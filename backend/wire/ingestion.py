# Anakin Wire - Primary Data Ingestion Layer

import feedparser
import yfinance as yf
import datetime
import requests

class WireIngestionEngine:
    def __init__(self):
        self.sources = {
            "news": ["https://techcrunch.com/feed/", "https://www.reutersagency.com/feed/?best-topics=tech&post_type=best"],
            "social": [],
            "polymarket": []
        }
        
    def fetch_news_signals(self):
        signals = []
        for url in self.sources["news"]:
            try:
                feed = feedparser.parse(url)
                for entry in feed.entries[:10]:
                    signals.append({
                        "type": "news",
                        "source": url,
                        "title": entry.title,
                        "content": getattr(entry, "summary", ""),
                        "timestamp": datetime.datetime.now().isoformat(),
                        "url": entry.link
                    })
            except Exception as e:
                print(f"Wire Error fetching {url}: {e}")
        return signals

    def fetch_company_signals(self, tickers=["MSFT", "AAPL", "NVDA"]):
        signals = []
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                data = stock.history(period="1d")
                if not data.empty:
                    signals.append({
                        "type": "company",
                        "ticker": ticker,
                        "price": data["Close"].iloc[-1],
                        "volume": int(data["Volume"].iloc[-1]),
                        "timestamp": datetime.datetime.now().isoformat()
                    })
            except Exception as e:
                print(f"Wire Error fetching {ticker}: {e}")
        return signals

    def run_full_ingestion(self):
        print("Anakin Wire: Initiating full signal ingestion...")
        signals = []
        signals.extend(self.fetch_news_signals())
        signals.extend(self.fetch_company_signals())
        return signals
    def fetch_dynamic_query(self, query: str):
        print(f"Anakin Wire: Dynamically intercepting live news for '{query}'...")
        signals = []
        url = f"https://news.google.com/rss/search?q={query}"
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:10]: # Top 10 latest articles
                signals.append({
                    "type": "news",
                    "source": "Google News",
                    "title": entry.title,
                    "content": getattr(entry, "summary", ""),
                    "timestamp": datetime.datetime.now().isoformat(),
                    "url": getattr(entry, "link", url)
                })
        except Exception as e:
            print(f"Wire Error fetching dynamic query {query}: {e}")
            
        # Wikipedia Fallback to guarantee real data for any query
        if len(signals) == 0:
            print(f"Anakin Wire: Google News returned 0 signals for '{query}'. Engaging Wikipedia fallback...")
            try:
                wiki_url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=True&explaintext=True&titles={query}"
                resp = requests.get(wiki_url)
                if resp.status_code == 200:
                    data = resp.json()
                    pages = data.get("query", {}).get("pages", {})
                    for page_id, page_data in pages.items():
                        if page_id != "-1" and "extract" in page_data:
                            signals.append({
                                "type": "encyclopedia",
                                "source": "Wikipedia Deep Index",
                                "title": page_data.get("title", query),
                                "content": page_data["extract"],
                                "timestamp": datetime.datetime.now().isoformat(),
                                "url": f"https://en.wikipedia.org/wiki/{query}"
                            })
            except Exception as e:
                print(f"Wire Error fetching Wikipedia for {query}: {e}")
                
        return signals

wire_engine = WireIngestionEngine()
