import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()
ANAKIN_API_KEY = os.getenv("ANAKIN_API_KEY", "")

def anakin_chatgpt(prompt: str, max_retries=15) -> str:
    """
    Sends a prompt to the Anakin Wire ChatGPT action asynchronously and polls for the response.
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
    
    # 1. Dispatch Task
    response = requests.post(url, json=payload, headers=headers, timeout=5)
    if response.status_code != 200:
        raise Exception(f"Anakin API Error: {response.text}")
        
    data = response.json()
    if "job_id" not in data:
        raise Exception(f"Anakin API didn't return job_id: {data}")
        
    poll_url = "https://api.anakin.io" + data["poll_url"]
    
    # 2. Poll for Completion (ChatGPT takes time)
    for _ in range(max_retries):
        time.sleep(3) # Poll every 3 seconds
        try:
            poll_res = requests.get(poll_url, headers=headers, timeout=5)
            if poll_res.status_code == 200:
                poll_data = poll_res.json()
                if poll_data.get("status") == "completed":
                    # Parse the answer_text from the successful response
                    answer = poll_data.get("data", {}).get("answer_text", "")
                    return answer
                elif poll_data.get("status") == "error":
                    raise Exception(f"Anakin Job Failed: {poll_data}")
        except Exception as e:
            print(f"[Anakin LLM] Polling error: {e}")
            
    raise Exception("Anakin ChatGPT polling timed out.")
