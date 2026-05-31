import requests
import re
query = "India"
url = f"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=5&exlimit=1&titles={query}&explaintext=1&format=json"
headers = {"User-Agent": "Mozilla/5.0"}
res = requests.get(url, headers=headers).json()
pages = res.get("query", {}).get("pages", {})
for page_id in pages:
    extract = pages[page_id].get("extract", "")
    print(extract)
