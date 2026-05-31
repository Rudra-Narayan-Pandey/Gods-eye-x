import os
import requests
import time
from dotenv import load_dotenv

from backend.logging import get_logger, categorize_exception

load_dotenv()
ANAKIN_API_KEY = os.getenv("ANAKIN_API_KEY", "")

logger = get_logger("backend.holocron.anakin_llm")


def anakin_chatgpt(prompt: str, max_retries=60) -> str:
    """
    Sends a prompt to the Anakin Wire ChatGPT action asynchronously and polls for the response.
    Emits structured logs with sanitized error categories and retry/backoff telemetry.
    Returns the answer_text.
    """
    if not ANAKIN_API_KEY:
        logger.error("Missing Anakin API key", extra={"event": "config_missing", "category": "invalid_api_key"})
        raise ValueError("ANAKIN_API_KEY is not set.")

    url = "https://api.anakin.io/v1/holocron/task"
    headers = {
        "X-API-Key": ANAKIN_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {"action_id": "chatgpt", "params": {"prompt": prompt}}

    # 1. Dispatch Task with rate-limit retry (telemetry)
    dispatch_attempts = 0
    max_dispatch_attempts = 5
    dispatch_start_ts = time.time()
    response = None

    while dispatch_attempts < max_dispatch_attempts:
        dispatch_attempts += 1
        try:
            logger.info("Dispatching Anakin task", extra={
                "event": "dispatch_attempt",
                "attempt": dispatch_attempts,
                "max_attempts": max_dispatch_attempts,
                "prompt_length": len(prompt),
            })
            response = requests.post(url, json=payload, headers=headers, timeout=10)

            if response.status_code in [200, 202]:
                logger.info("Anakin dispatch accepted", extra={"event": "dispatch_success", "status": response.status_code, "attempt": dispatch_attempts})
                break

            if response.status_code == 429:
                category, msg = categorize_exception(Exception("HTTP 429"))
                wait_time = min(30, 5 * (2 ** dispatch_attempts))
                logger.warning("Rate limited on dispatch", extra={"event": "dispatch_rate_limited", "category": category, "attempt": dispatch_attempts, "wait_time": wait_time})
                time.sleep(wait_time)
                continue

            # Other non-success HTTP statuses
            category, sanitized = categorize_exception(Exception(f"HTTP {response.status_code}"))
            logger.error("Anakin API error during dispatch", extra={"event": "dispatch_error", "category": category, "status": response.status_code, "response_preview": response.text[:400]})
            raise Exception(f"Anakin API Error ({response.status_code}): {response.text}")

        except requests.exceptions.Timeout as e:
            category, sanitized = categorize_exception(e)
            logger.warning("Dispatch timeout", extra={"event": "dispatch_timeout", "category": category, "attempt": dispatch_attempts, "error": sanitized})
            time.sleep(5)
            continue
        except requests.exceptions.RequestException as e:
            category, sanitized = categorize_exception(e)
            logger.error("Network error while dispatching Anakin task", extra={"event": "dispatch_network_error", "category": category, "attempt": dispatch_attempts, "error": sanitized})
            time.sleep(5)
            continue
        except Exception as e:
            category, sanitized = categorize_exception(e)
            logger.exception("Unhandled exception during dispatch", extra={"event": "dispatch_exception", "category": category, "attempt": dispatch_attempts, "error": sanitized})
            raise
    else:
        logger.error("Max dispatch attempts exceeded", extra={"event": "dispatch_failed", "attempts": dispatch_attempts})
        raise Exception("Anakin API: Max dispatch attempts exceeded due to rate limiting.")

    try:
        data = response.json()
    except Exception as e:
        category, sanitized = categorize_exception(e)
        logger.error("Failed to parse dispatch response JSON", extra={"event": "dispatch_parse_error", "category": category, "error": sanitized, "response_text_preview": (response.text[:400] if response is not None else None)})
        raise

    if "job_id" not in data:
        logger.error("Dispatch response missing job_id", extra={"event": "dispatch_no_job_id", "data_preview": str(data)[:500]})
        raise Exception(f"Anakin API didn't return job_id: {data}")

    poll_url = "https://api.anakin.io" + data["poll_url"]
    job_id = data["job_id"]
    logger.info("Job dispatched; starting poll loop", extra={"event": "dispatch_completed", "job_id": job_id, "poll_url": poll_url})

    # 2. Poll for Completion with rate-limit backoff and telemetry
    rate_limit_hits = 0
    poll_attempts = 0
    poll_start_ts = time.time()

    for attempt in range(max_retries):
        poll_attempts += 1
        time.sleep(3)
        try:
            logger.debug("Polling job status", extra={"event": "poll_attempt", "job_id": job_id, "attempt": poll_attempts})
            poll_res = requests.get(poll_url, headers=headers, timeout=10)

            if poll_res.status_code == 429:
                rate_limit_hits += 1
                wait_time = min(30, 5 * (2 ** min(rate_limit_hits, 4)))
                logger.warning("Rate limited on poll", extra={"event": "poll_rate_limited", "attempt": poll_attempts, "wait_time": wait_time})
                time.sleep(wait_time)
                continue

            if poll_res.status_code != 200:
                logger.warning("Unexpected poll HTTP status", extra={"event": "poll_unexpected_status", "status": poll_res.status_code, "attempt": poll_attempts})
                continue

            poll_data = poll_res.json()
            status = poll_data.get("status")

            logger.info("Poll response received", extra={"event": "poll_response", "job_id": job_id, "attempt": poll_attempts, "status": status})

            if status == "completed":
                answer = poll_data.get("data", {}).get("answer_text", "")
                logger.info("Job completed", extra={"event": "job_completed", "job_id": job_id, "answer_len": len(answer), "poll_attempts": poll_attempts, "elapsed_s": time.time() - poll_start_ts})
                return answer

            if status == "error":
                error_info = poll_data.get("error", {})
                if error_info.get("code") == "RATE_LIMIT_EXCEEDED":
                    rate_limit_hits += 1
                    wait_time = min(60, 10 * (2 ** min(rate_limit_hits, 4)))
                    logger.warning("Poll returned RATE_LIMIT_EXCEEDED", extra={"event": "poll_rate_limit_error", "job_id": job_id, "attempt": poll_attempts, "wait_time": wait_time, "error_info": error_info})
                    time.sleep(wait_time)
                    continue
                category, sanitized = categorize_exception(Exception(str(error_info)))
                logger.error("Anakin job failed with error status", extra={"event": "job_failed", "job_id": job_id, "category": category, "error_info": sanitized})
                raise Exception(f"Anakin Job Failed: {poll_data}")

            # processing -> continue
        except requests.exceptions.Timeout as e:
            category, sanitized = categorize_exception(e)
            logger.warning("Poll timeout", extra={"event": "poll_timeout", "job_id": job_id, "attempt": poll_attempts, "error": sanitized})
        except requests.exceptions.RequestException as e:
            category, sanitized = categorize_exception(e)
            logger.error("Network error while polling job", extra={"event": "poll_network_error", "job_id": job_id, "attempt": poll_attempts, "error": sanitized})
        except Exception as e:
            category, sanitized = categorize_exception(e)
            logger.exception("Unexpected polling exception", extra={"event": "poll_exception", "job_id": job_id, "attempt": poll_attempts, "category": category, "error": sanitized})

    logger.error("Polling timed out after max retries", extra={"event": "polling_timed_out", "job_id": job_id, "poll_attempts": poll_attempts, "elapsed_s": time.time() - poll_start_ts})
    raise Exception("Anakin ChatGPT polling timed out after all retries.")
