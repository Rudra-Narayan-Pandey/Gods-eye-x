import feedparser
url = "https://news.google.com/rss/search?q=india"
feed = feedparser.parse(url)
for entry in feed.entries[:3]:
    print("TITLE:", entry.title)
    import re
    clean = re.sub(r'<[^>]+>', '', getattr(entry, "summary", ""))
    print("CONTENT:", clean)
    print("---")
