import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()
ANAKIN_API_KEY = os.getenv("ANAKIN_API_KEY", "")

def anakin_chatgpt(prompt: str, max_retries=60) -> str:
    """
    Sends a prompt to the Anakin Wire ChatGPT action asynchronously and polls for the response.
    Includes exponential backoff for rate limit handling.
    Returns the answer_text.
    """
    if not ANAKIN_API_KEY:
        raise ValueError("ANAKIN_API_KEY is not set.")
        
    url = "https://api.anakin.io/v1/holocron/task"
    headers = {
        "X-API-Key": ANAKIN_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "action_id": "chatgpt",
        "params": {"prompt": prompt}
    }
    
    # 1. Dispatch Task with rate-limit retry
    dispatch_attempts = 0
    max_dispatch_attempts = 5
    while dispatch_attempts < max_dispatch_attempts:
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if response.status_code in [200, 202]:
                break
            elif response.status_code == 429:
                dispatch_attempts += 1
                wait_time = min(30, 5 * (2 ** dispatch_attempts))
                print(f"[Anakin LLM] Rate limited on dispatch. Waiting {wait_time}s (attempt {dispatch_attempts}/{max_dispatch_attempts})...")
                time.sleep(wait_time)
                continue
            else:
                raise Exception(f"Anakin API Error ({response.status_code}): {response.text}")
        except requests.exceptions.Timeout:
            dispatch_attempts += 1
            print(f"[Anakin LLM] Dispatch timeout (attempt {dispatch_attempts}/{max_dispatch_attempts})...")
            time.sleep(5)
            continue
    else:
        raise Exception("Anakin API: Max dispatch attempts exceeded due to rate limiting.")
        
    data = response.json()
    if "job_id" not in data:
        raise Exception(f"Anakin API didn't return job_id: {data}")
        
    poll_url = "https://api.anakin.io" + data["poll_url"]
    job_id = data["job_id"]
    print(f"[Anakin LLM] Job dispatched: {job_id}. Polling for completion...")
    
    # 2. Poll for Completion with rate-limit backoff
    rate_limit_hits = 0
    for attempt in range(max_retries):
        time.sleep(3)
        try:
            poll_res = requests.get(poll_url, headers=headers, timeout=10)
            
            if poll_res.status_code == 429:
                rate_limit_hits += 1
                wait_time = min(30, 5 * (2 ** min(rate_limit_hits, 4)))
                print(f"[Anakin LLM] Rate limited on poll. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
                
            if poll_res.status_code == 200:
                poll_data = poll_res.json()
                status = poll_data.get("status")
                
                if status == "completed":
                    answer = poll_data.get("data", {}).get("answer_text", "")
                    print(f"[Anakin LLM] Job completed successfully. Response length: {len(answer)}")
                    return answer
                elif status == "error":
                    error_info = poll_data.get("error", {})
                    if error_info.get("code") == "RATE_LIMIT_EXCEEDED":
                        rate_limit_hits += 1
                        wait_time = min(60, 10 * (2 ** min(rate_limit_hits, 4)))
                        print(f"[Anakin LLM] Rate limited (error status). Waiting {wait_time}s...")
                        time.sleep(wait_time)
                        continue
                    raise Exception(f"Anakin Job Failed: {poll_data}")
                elif status == "processing":
                    pass  # Still working, continue polling
                    
        except requests.exceptions.Timeout:
            print(f"[Anakin LLM] Poll timeout on attempt {attempt+1}")
        except Exception as e:
            if "Rate" in str(e) or "rate" in str(e):
                rate_limit_hits += 1
                wait_time = min(30, 5 * (2 ** min(rate_limit_hits, 4)))
                print(f"[Anakin LLM] Rate limit exception. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"[Anakin LLM] Polling error: {e}")
            
    raise Exception("Anakin ChatGPT polling timed out after all retries.")
