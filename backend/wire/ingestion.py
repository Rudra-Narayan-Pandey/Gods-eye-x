# Anakin Wire - Primary Data Ingestion Layer

import feedparser
import yfinance as yf
import datetime
import requests
import os
import urllib.request
import xml.etree.ElementTree as ET
import json
from urllib.parse import quote_plus

ANAKIN_API_KEY = os.getenv("ANAKIN_API_KEY", "")

ALAKIN_SOURCE_CATALOG = {
    "news": ["AP News", "Al Jazeera", "BBC News", "CNBC", "Google News", "Reuters", "TechCrunch", "The Guardian"],
    "finance": ["BIS", "BLS", "BSE India", "CBOE", "CFTC", "CoinGecko", "ECB", "EIA", "FRED", "NSE India", "SEC EDGAR", "US Treasury", "Yahoo Finance"],
    "research": ["OpenAlex", "PubMed", "Semantic Scholar", "arXiv"],
    "developer-tools": ["AlternativeTo", "DEV Community", "GitHub", "Hacker News", "npm", "PyPI", "StackOverflow"],
    "prediction-markets": ["Kalshi", "Manifold Markets", "Polymarket"],
    "travel": ["Agoda", "Airbnb", "Booking.com", "Google Flights", "Skyscanner", "seats.aero"],
    "commerce": ["Amazon", "Costco", "eBay", "Flipkart", "Target", "Walmart"],
    "domains": ["GoDaddy", "Instant Domain Search", "Name.com", "WHOIS / Domain Intel"],
}

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

    def fetch_polymarket_signals(self, query: str):
        print(f"Anakin Wire: Connecting to live Polymarket Gamma API for '{query}'...")
        pm_signals = []
        try:
            url = f"https://gamma-api.polymarket.com/events?limit=50&active=true&closed=false"
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            resp = requests.get(url, headers=headers, timeout=4)
            if resp.status_code == 200:
                events = resp.json()
                
                # Filter events by query if possible, otherwise just take the top 2 macro events
                matched_events = [e for e in events if query.lower() in e.get("title", "").lower() or query.lower() in e.get("description", "").lower()]
                if not matched_events:
                    matched_events = events[:2] # Fallback to top global markets if no direct match
                else:
                    matched_events = matched_events[:2]
                    
                for event in matched_events:
                    markets = event.get("markets", [])
                    if markets:
                        market = markets[0]
                        outcomes = json.loads(market.get("outcomes", "[]"))
                        prices = json.loads(market.get("outcomePrices", "[]"))
                        
                        yes_prob = 0
                        no_prob = 0
                        if "Yes" in outcomes and "No" in outcomes:
                            yes_idx = outcomes.index("Yes")
                            no_idx = outcomes.index("No")
                            yes_prob = round(float(prices[yes_idx]) * 100) if len(prices) > yes_idx else 0
                            no_prob = round(float(prices[no_idx]) * 100) if len(prices) > no_idx else 0
                            
                        pm_signals.append({
                            "type": "polymarket",
                            "title": event.get("title", ""),
                            "yes_prob": yes_prob,
                            "no_prob": no_prob,
                            "volume": event.get("volume", 0),
                            "liquidity": event.get("liquidity", 0),
                            "source": "Polymarket Gamma API",
                            "url": event.get("slug", "")
                        })
        except Exception as e:
            print(f"Polymarket API Error / Network Timeout: {e}. No simulated market data will be injected.")
        return pm_signals

    def _parse_anakin_results(self, payload):
        data = payload.get("data", payload)
        candidates = data.get("results") or data.get("items") or data.get("articles") or data.get("data") or []
        if isinstance(candidates, dict):
            candidates = candidates.get("results") or candidates.get("items") or []

        parsed = []
        for item in candidates[:10]:
            if not isinstance(item, dict):
                continue
            title = item.get("title") or item.get("headline") or item.get("name") or ""
            content = item.get("description") or item.get("summary") or item.get("content") or title
            if not title and not content:
                continue
            parsed.append({
                "type": item.get("type", "news"),
                "source": item.get("source") or item.get("publisher") or "Anakin Wire API",
                "title": title,
                "content": content,
                "timestamp": item.get("published") or item.get("published_at") or datetime.datetime.now().isoformat(),
                "url": item.get("url") or item.get("link") or "",
            })
        return parsed

    def _run_anakin_action(self, action_id, params):
        if not ANAKIN_API_KEY:
            return []

        anakin_url = "https://api.anakin.io/v1/holocron/task"
        headers = {"X-API-Key": ANAKIN_API_KEY, "Content-Type": "application/json"}
        response = requests.post(anakin_url, json={"action_id": action_id, "params": params}, headers=headers, timeout=10)
        if response.status_code not in [200, 202]:
            raise RuntimeError(f"Anakin action {action_id} returned {response.status_code}: {response.text[:300]}")

        data = response.json()
        if "job_id" not in data:
            return self._parse_anakin_results(data)

        poll_url = "https://api.anakin.io" + data["poll_url"]
        import time
        for _ in range(12):
            time.sleep(1)
            poll_res = requests.get(poll_url, headers={"X-API-Key": ANAKIN_API_KEY}, timeout=10)
            if poll_res.status_code != 200:
                continue
            poll_data = poll_res.json()
            if poll_data.get("status") == "completed":
                return self._parse_anakin_results(poll_data)
            if poll_data.get("status") == "error":
                raise RuntimeError(f"Anakin action {action_id} failed: {poll_data}")
        raise TimeoutError(f"Anakin action {action_id} polling timed out")

    def fetch_dynamic_query(self, query: str):
        print(f"Anakin Wire: API key configured: {'yes' if ANAKIN_API_KEY else 'no'}")
        print(f"Anakin Wire: Executing live wire extraction for '{query}'...")
        signals = []
        
        if ANAKIN_API_KEY:
            for action_id, params in [
                ("google_news_search", {"keyword": query}),
                ("gn_search", {"query": query}),
            ]:
                try:
                    print(f"Anakin Wire: Dispatching live action '{action_id}' for '{query}'...")
                    action_signals = self._run_anakin_action(action_id, params)
                    signals.extend(action_signals)
                    if action_signals:
                        print(f"Anakin Wire: action '{action_id}' returned {len(action_signals)} signals.")
                        break
                except Exception as e:
                    print(f"Anakin Wire action '{action_id}' unavailable: {e}")

        print(f"Anakin Wire: Querying public live sources for '{query}'...")
        url = f"https://news.google.com/rss/search?q={quote_plus(query)}"
        try:
            res = requests.get(url, timeout=5)
            feed = feedparser.parse(res.content)
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
            
        # Wikipedia only adds real encyclopedia context; it is skipped if no page exists.
        if len(signals) == 0:
            print(f"Anakin Wire: Google News returned 0 signals for '{query}'. Engaging Wikipedia fallback...")
            try:
                wiki_url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=True&explaintext=True&titles={quote_plus(query)}"
                resp = requests.get(wiki_url, timeout=5)
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
                "url": f"https://en.wikipedia.org/wiki/{quote_plus(query)}"
                            })
            except Exception as e:
                print(f"Wire Error fetching Wikipedia for {query}: {e}")

        # ── ANAKIN INTEGRATION: YAHOO FINANCE (Financial Data) ──
        print(f"Anakin Wire: Querying Yahoo Finance Integration for '{query}'...")
        try:
            # Map common names to tickers
            ticker = query.upper()
            if "APPLE" in ticker: ticker = "AAPL"
            elif "MICROSOFT" in ticker: ticker = "MSFT"
            elif "NVIDIA" in ticker: ticker = "NVDA"
            elif "GOOGLE" in ticker or "ALPHABET" in ticker: ticker = "GOOGL"
            elif "TESLA" in ticker: ticker = "TSLA"
            
            from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeout
            stock = yf.Ticker(ticker)
            
            # yfinance can hang indefinitely on datacenter IPs, wrap in strict timeout
            info = {}
            with ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(lambda: stock.info)
                try:
                    info = future.result(timeout=3)
                except FuturesTimeout:
                    print(f"Anakin Wire: Yahoo Finance timed out for {ticker} (possible datacenter block).")
                except Exception as e:
                    print(f"Anakin Wire: Yahoo Finance error for {ticker}: {e}")

            if info and "currentPrice" in info:
                price = info.get("currentPrice", "N/A")
                market_cap = info.get("marketCap", "N/A")
                if market_cap != "N/A": market_cap = f"${market_cap/1e9:.2f}B"
                signals.append({
                    "type": "financial",
                    "source": "Yahoo Finance (Anakin Integration)",
                    "title": f"{ticker} Live Market Data: ${price}",
                    "content": f"Real-time Yahoo Finance data. Price: ${price}. Market Cap: {market_cap}. Day High: ${info.get('dayHigh', 'N/A')}. 52-Week High: ${info.get('fiftyTwoWeekHigh', 'N/A')}. Sector: {info.get('sector', 'N/A')}.",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "url": f"https://finance.yahoo.com/quote/{ticker}"
                })
        except Exception as e:
            print(f"Wire Error fetching Yahoo Finance for {query}: {e}")

        # ── ANAKIN INTEGRATION: arXiv (Academic Research) ──
        print(f"Anakin Wire: Querying arXiv Academic Integration for '{query}'...")
        try:
            search_q = quote_plus(query)
            arxiv_url = f"http://export.arxiv.org/api/query?search_query=all:{search_q}&start=0&max_results=2"
            with urllib.request.urlopen(arxiv_url, timeout=5) as response:
                xml_data = response.read()
                root = ET.fromstring(xml_data)
                for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
                    title = entry.find("{http://www.w3.org/2005/Atom}title").text.replace('\n', ' ')
                    summary = entry.find("{http://www.w3.org/2005/Atom}summary").text.replace('\n', ' ')
                    link = entry.find("{http://www.w3.org/2005/Atom}id").text
                    signals.append({
                        "type": "academic",
                        "source": "arXiv (Anakin Integration)",
                        "title": f"Academic Research: {title[:80]}...",
                        "content": summary[:300] + "...",
                        "timestamp": datetime.datetime.now().isoformat(),
                        "url": link
                    })
        except Exception as e:
            print(f"Wire Error fetching arXiv for {query}: {e}")

        # ── ANAKIN INTEGRATION: GitHub (Developer Tools) ──
        print(f"Anakin Wire: Querying GitHub Integration for '{query}'...")
        try:
            gh_url = f"https://api.github.com/search/repositories?q={quote_plus(query)}&sort=stars&order=desc&per_page=2"
            gh_resp = requests.get(gh_url, headers={"User-Agent": "GodsEyeX"}, timeout=5)
            if gh_resp.status_code == 200:
                items = gh_resp.json().get("items", [])
                for item in items:
                    signals.append({
                        "type": "code",
                        "source": "GitHub (Anakin Integration)",
                        "title": f"Open Source: {item.get('full_name')}",
                        "content": f"{item.get('description', 'No description')} - Stars: {item.get('stargazers_count')} - Language: {item.get('language')}",
                        "timestamp": datetime.datetime.now().isoformat(),
                        "url": item.get("html_url")
                    })
        except Exception as e:
            print(f"Wire Error fetching GitHub for {query}: {e}")
                
        # Append real Polymarket data
        pm_data = self.fetch_polymarket_signals(query)
        for pm in pm_data:
            signals.append(pm)
                
        return signals

wire_engine = WireIngestionEngine()
