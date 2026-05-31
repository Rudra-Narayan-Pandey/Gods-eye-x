import requests, time, json

key = "ask_a0ba623bd6752e230fbc5d15649722dd1b800f6bfff4e8e063b43aff8a38b833"
headers = {"X-API-Key": key}
poll_url = "https://api.anakin.io/v1/holocron/jobs/37df9318-7992-4d2c-8f23-a06be5eab8c2"

for i in range(20):
    time.sleep(3)
    r = requests.get(poll_url, headers=headers, timeout=5)
    data = r.json()
    status = data.get("status")
    print(f"Poll {i+1}: status={status}")
    if status == "completed":
        print(json.dumps(data, indent=2)[:3000])
        break
    elif status == "error":
        print("ERROR:", data)
        break
