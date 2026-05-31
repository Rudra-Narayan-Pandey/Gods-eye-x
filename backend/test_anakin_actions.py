import requests, time, json

key = "ask_a0ba623bd6752e230fbc5d15649722dd1b800f6bfff4e8e063b43aff8a38b833"
headers = {"X-API-Key": key, "Content-Type": "application/json"}

# Test multiple Anakin actions to see which ones work
actions_to_test = [
    {"action_id": "google_news_search", "params": {"keyword": "india economy"}},
    {"action_id": "gn_search", "params": {"query": "india economy"}},
    {"action_id": "chatgpt", "params": {"prompt": "Say hello"}},
]

for action in actions_to_test:
    print(f"\n=== Testing action: {action['action_id']} ===")
    try:
        r = requests.post("https://api.anakin.io/v1/holocron/task", json=action, headers=headers, timeout=10)
        print(f"Status: {r.status_code}")
        data = r.json()
        print(f"Response: {json.dumps(data, indent=2)[:500]}")
        
        if r.status_code in [200, 202] and "job_id" in data:
            poll_url = "https://api.anakin.io" + data["poll_url"]
            print(f"Polling job: {data['job_id']}")
            for i in range(30):
                time.sleep(3)
                pr = requests.get(poll_url, headers={"X-API-Key": key}, timeout=5)
                pd = pr.json()
                status = pd.get("status")
                print(f"  Poll {i+1}: {status}")
                if status == "completed":
                    print(json.dumps(pd, indent=2)[:2000])
                    break
                elif status == "error":
                    print(f"  Error: {pd}")
                    break
    except Exception as e:
        print(f"Exception: {e}")
    time.sleep(2)
