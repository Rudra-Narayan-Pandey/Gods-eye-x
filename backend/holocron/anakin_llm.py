import os
import requests
import time
import random
import threading
from dotenv import load_dotenv

from backend.logging import get_logger, categorize_exception

load_dotenv()
ANAKIN_API_KEY = os.getenv("ANAKIN_API_KEY", "")

logger = get_logger("backend.holocron.anakin_llm")

# Circuit breaker configuration (can be tuned via environment variables)
FAILURE_THRESHOLD = int(os.getenv("ANAKIN_FAILURE_THRESHOLD", "3"))
FAILURE_WINDOW = int(os.getenv("ANAKIN_FAILURE_WINDOW", "300"))  # seconds
COOLDOWN_SECONDS = int(os.getenv("ANAKIN_COOLDOWN_SECONDS", "120"))

_CIRCUIT = {"failure_count": 0, "first_failure_ts": None, "open_until": 0.0}
_CIRCUIT_LOCK = threading.Lock()


def _record_failure():
    with _CIRCUIT_LOCK:
        now = time.time()
        first = _CIRCUIT.get("first_failure_ts")
        if not first or now - first > FAILURE_WINDOW:
            _CIRCUIT["failure_count"] = 1
            _CIRCUIT["first_failure_ts"] = now
        else:
            _CIRCUIT["failure_count"] += 1
        if _CIRCUIT["failure_count"] >= FAILURE_THRESHOLD:
            _CIRCUIT["open_until"] = now + COOLDOWN_SECONDS
            logger.warning("Circuit opened for Anakin API", extra={"event": "circuit_opened", "open_until": _CIRCUIT["open_until"]})


def _record_success():
    with _CIRCUIT_LOCK:
        _CIRCUIT["failure_count"] = 0
        _CIRCUIT["first_failure_ts"] = None
        _CIRCUIT["open_until"] = 0.0
        logger.info("Circuit reset for Anakin API", extra={"event": "circuit_reset"})


def is_circuit_open() -> bool:
    with _CIRCUIT_LOCK:
        return time.time() < _CIRCUIT["open_until"]


def get_circuit_state() -> dict:
    with _CIRCUIT_LOCK:
        now = time.time()
        return {
            "failure_count": _CIRCUIT["failure_count"],
            "first_failure_ts": _CIRCUIT["first_failure_ts"],
            "open_until": _CIRCUIT["open_until"],
            "is_open": now < _CIRCUIT["open_until"],
        }


def anakin_health_check(timeout: int = 5) -> dict:
    """Lightweight health check for Anakin API. Returns sanitized status and does not expose secrets."""
    if not ANAKIN_API_KEY:
        return {"configured": False, "status": "no_api_key"}
    ping_url = os.getenv("ANAKIN_PING_URL", "https://api.anakin.io/v1/holocron/ping")
    headers = {"X-API-Key": ANAKIN_API_KEY}
    try:
        r = requests.get(ping_url, headers=headers, timeout=timeout)
        if r.status_code == 200:
            _record_success()
            return {"configured": True, "status": "ok", "http_status": r.status_code}
        if r.status_code in (401, 403):
            _record_failure()
            return {"configured": True, "status": "invalid_api_key", "http_status": r.status_code}
        _record_failure()
        return {"configured": True, "status": "unavailable", "http_status": r.status_code}
    except requests.exceptions.RequestException as e:
        category, msg = categorize_exception(e)
        _record_failure()
        return {"configured": True, "status": "network_error", "category": category, "error": msg}


def anakin_chatgpt(prompt: str, max_retries: int = 60) -> str:
    """
    Sends a prompt to the Anakin Wire ChatGPT action asynchronously and polls for the response.
    Emits structured logs with sanitized error categories and retry/backoff telemetry.
    Uses a circuit breaker to avoid hammering a failing upstream service.
    Returns the answer_text.
    """
    if not ANAKIN_API_KEY:
        logger.error("Missing Anakin API key", extra={"event": "config_missing", "category": "invalid_api_key"})
        raise ValueError("ANAKIN_API_KEY is not set.")

    if is_circuit_open():
        logger.warning("Anakin circuit is open; refusing to dispatch", extra={"event": "circuit_open_skip"})
        raise Exception("Anakin service temporarily disabled due to repeated failures. See diagnostics.")

    url = os.getenv("ANAKIN_API_URL", "https://api.anakin.io/v1/holocron/task")
    headers = {
        "X-API-Key": ANAKIN_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {"action_id": "chatgpt", "params": {"prompt": prompt}}

    max_redeploys = int(os.getenv("ANAKIN_REDISPATCH_MAX", "1"))
    redeploy_count = 0

    while True:
        # 1. Dispatch Task with rate-limit retry (telemetry)
        dispatch_attempts = 0
        max_dispatch_attempts = 5
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
                    _record_failure()
                    time.sleep(wait_time)
                    continue

                # Other non-success HTTP statuses
                category, sanitized = categorize_exception(Exception(f"HTTP {response.status_code}"))
                logger.error("Anakin API error during dispatch", extra={"event": "dispatch_error", "category": category, "status": response.status_code, "response_preview": response.text[:400]})
                _record_failure()
                raise Exception(f"Anakin API Error ({response.status_code}): {response.text}")

            except requests.exceptions.Timeout as e:
                category, sanitized = categorize_exception(e)
                logger.warning("Dispatch timeout", extra={"event": "dispatch_timeout", "category": category, "attempt": dispatch_attempts, "error": sanitized})
                _record_failure()
                time.sleep(5)
                continue
            except requests.exceptions.RequestException as e:
                category, sanitized = categorize_exception(e)
                logger.error("Network error while dispatching Anakin task", extra={"event": "dispatch_network_error", "category": category, "attempt": dispatch_attempts, "error": sanitized})
                _record_failure()
                time.sleep(5)
                continue
            except Exception as e:
                category, sanitized = categorize_exception(e)
                logger.exception("Unhandled exception during dispatch", extra={"event": "dispatch_exception", "category": category, "attempt": dispatch_attempts, "error": sanitized})
                _record_failure()
                raise
        else:
            logger.error("Max dispatch attempts exceeded", extra={"event": "dispatch_failed", "attempts": dispatch_attempts})
            _record_failure()
            raise Exception("Anakin API: Max dispatch attempts exceeded due to rate limiting.")

        try:
            data = response.json()
        except Exception as e:
            category, sanitized = categorize_exception(e)
            logger.error("Failed to parse dispatch response JSON", extra={"event": "dispatch_parse_error", "category": category, "error": sanitized, "response_text_preview": (response.text[:400] if response is not None else None)})
            _record_failure()
            raise

        if "job_id" not in data:
            logger.error("Dispatch response missing job_id", extra={"event": "dispatch_no_job_id", "data_preview": str(data)[:500]})
            _record_failure()
            raise Exception(f"Anakin API didn't return job_id: {data}")

        poll_url = os.getenv("ANAKIN_BACKEND_HOST", "https://api.anakin.io") + data["poll_url"]
        job_id = data["job_id"]
        logger.info("Job dispatched; starting poll loop", extra={"event": "dispatch_completed", "job_id": job_id, "poll_url": poll_url})

        # 2. Poll for Completion with rate-limit backoff and telemetry
        rate_limit_hits = 0
        poll_attempts = 0
        poll_start_ts = time.time()
        final_answer = None

        for attempt in range(max_retries):
            poll_attempts += 1
            time.sleep(min(3 + attempt * 0.5, 10))
            try:
                logger.debug("Polling job status", extra={"event": "poll_attempt", "job_id": job_id, "attempt": poll_attempts})
                poll_res = requests.get(poll_url, headers=headers, timeout=10)

                if poll_res.status_code == 429:
                    rate_limit_hits += 1
                    if rate_limit_hits > 3:
                        logger.error("Rate limit retry max exceeded", extra={"event": "poll_rate_limited_max"})
                        raise Exception("Anakin API Rate Limit Exceeded.")
                    wait_time = 2 + (rate_limit_hits * 2)
                    logger.warning("Rate limited on poll", extra={"event": "poll_rate_limited", "attempt": poll_attempts, "wait_time": wait_time})
                    _record_failure()
                    time.sleep(wait_time)
                    continue

                if poll_res.status_code != 200:
                    logger.warning("Unexpected poll HTTP status", extra={"event": "poll_unexpected_status", "status": poll_res.status_code, "attempt": poll_attempts})
                    _record_failure()
                    continue

                poll_data = poll_res.json()
                status = poll_data.get("status")

                logger.info("Poll response received", extra={"event": "poll_response", "job_id": job_id, "attempt": poll_attempts, "status": status})

                if status == "completed":
                    final_answer = poll_data.get("data", {}).get("answer_text", "")
                    logger.info("Job completed", extra={"event": "job_completed", "job_id": job_id, "answer_len": len(final_answer), "poll_attempts": poll_attempts, "elapsed_s": time.time() - poll_start_ts})
                    if final_answer and str(final_answer).strip():
                        _record_success()
                        return final_answer
                    else:
                        logger.warning("Anakin returned empty answer; will consider redeploying", extra={"event": "empty_answer", "job_id": job_id, "attempts": poll_attempts})
                        # break to allow a redeploy attempt if configured
                        break

                if status == "error":
                    error_info = poll_data.get("error", {})
                    if error_info.get("code") == "RATE_LIMIT_EXCEEDED":
                        rate_limit_hits += 1
                        wait_time = min(60, 10 * (2 ** min(rate_limit_hits, 4)))
                        logger.warning("Poll returned RATE_LIMIT_EXCEEDED", extra={"event": "poll_rate_limit_error", "job_id": job_id, "attempt": poll_attempts, "wait_time": wait_time, "error_info": error_info})
                        _record_failure()
                        time.sleep(wait_time)
                        continue
                    category, sanitized = categorize_exception(Exception(str(error_info)))
                    logger.error("Anakin job failed with error status", extra={"event": "job_failed", "job_id": job_id, "category": category, "error_info": sanitized})
                    _record_failure()
                    raise Exception(f"Anakin Job Failed: {poll_data}")

                # processing -> continue
            except requests.exceptions.Timeout as e:
                category, sanitized = categorize_exception(e)
                logger.warning("Poll timeout", extra={"event": "poll_timeout", "job_id": job_id, "attempt": poll_attempts, "error": sanitized})
                _record_failure()
            except requests.exceptions.RequestException as e:
                category, sanitized = categorize_exception(e)
                logger.error("Network error while polling job", extra={"event": "poll_network_error", "job_id": job_id, "attempt": poll_attempts, "error": sanitized})
                _record_failure()
            except Exception as e:
                category, sanitized = categorize_exception(e)
                logger.exception("Unexpected polling exception", extra={"event": "poll_exception", "job_id": job_id, "attempt": poll_attempts, "category": category, "error": sanitized})
                _record_failure()

        # If we get here, either polling timed out or we received an empty answer
        if final_answer and str(final_answer).strip():
            _record_success()
            return final_answer

        # Decide whether to redeploy (i.e., issue a fresh dispatch) when answer is empty
        redeploy_count += 1
        if redeploy_count > max_redeploys:
            logger.error("Max redeploy attempts reached; returning fallback behavior", extra={"event": "redeploy_exhausted", "redeploy_count": redeploy_count})
            if final_answer is not None:
                return final_answer
            raise Exception("Anakin returned empty responses and redeploy attempts exhausted.")

        # Wait briefly with jitter before retrying full dispatch
        wait_before = min(2 * redeploy_count, 10) + random.random()
        logger.info("Retrying full dispatch due to empty answer", extra={"event": "redeploy", "redeploy_count": redeploy_count, "wait_before": wait_before})
        time.sleep(wait_before)
