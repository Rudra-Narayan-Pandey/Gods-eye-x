import sys
import json
import requests
import time
from dotenv import load_dotenv
import os

load_dotenv()
ANAKIN_API_KEY = os.getenv("ANAKIN_API_KEY", "")

url = "https://api.anakin.io/v1/holocron/task"
headers = {
    "X-API-Key": ANAKIN_API_KEY,
    "Content-Type": "application/json"
}
payload = {
    "action_id": "chatgpt",
    "params": {"prompt": "Say YES"}
}

print("Dispatching task...")
response = requests.post(url, json=payload, headers=headers, timeout=5)
print("Status:", response.status_code)
print("Response:", response.text)

if response.status_code in [200, 202]:
    data = response.json()
    poll_url = "https://api.anakin.io" + data["poll_url"]
    print("Polling:", poll_url)
    
    for i in range(10):
        time.sleep(3)
        poll_res = requests.get(poll_url, headers=headers, timeout=5)
        print(f"Poll {i} Status: {poll_res.status_code}")
        print(f"Poll {i} Body: {poll_res.text}")
        if poll_res.status_code == 200:
            d = poll_res.json()
            if d.get("status") == "completed":
                print("DONE!")
                break
