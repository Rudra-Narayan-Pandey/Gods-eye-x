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
from dotenv import load_dotenv
from backend.logging import get_logger, categorize_exception

# Load environment variables from .env (so ANAKIN_API_KEY is available when running the server)
load_dotenv()
ANAKIN_API_KEY = os.getenv("ANAKIN_API_KEY", "")
logger = get_logger("backend.wire.ingestion")
logger.info("Anakin Wire: API key configured at module load", extra={"configured": bool(ANAKIN_API_KEY)})

# Attempt to import the Anakin circuit helper (best-effort; avoid hard failure if module import order differs)
try:
    from backend.holocron.anakin_llm import is_circuit_open
except Exception:
    def is_circuit_open():
        return False

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
            logger.info("Skipping Anakin action because API key is not configured", extra={"event": "anakin_skip_no_key", "action_id": action_id})
            return []

        if is_circuit_open():
            logger.warning("Anakin circuit is open; skipping action to avoid cascading failures", extra={"event": "anakin_circuit_open", "action_id": action_id})
            return []

        anakin_url = "https://api.anakin.io/v1/holocron/task"
        headers = {"X-API-Key": ANAKIN_API_KEY, "Content-Type": "application/json"}

        # Dispatch with retry/backoff telemetry
        dispatch_attempts = 0
        max_dispatch_attempts = 3
        response = None
        while dispatch_attempts < max_dispatch_attempts:
            dispatch_attempts += 1
            try:
                logger.info("Dispatching Anakin action", extra={"event": "anakin_dispatch", "action_id": action_id, "attempt": dispatch_attempts})
                response = requests.post(anakin_url, json={"action_id": action_id, "params": params}, headers=headers, timeout=10)

                if response.status_code in [200, 202]:
                    logger.info("Anakin action dispatch accepted", extra={"event": "anakin_dispatch_success", "action_id": action_id, "status": response.status_code, "attempt": dispatch_attempts})
                    break

                if response.status_code == 429:
                    category, msg = categorize_exception(Exception("HTTP 429"))
                    wait_time = min(30, 2 ** dispatch_attempts)
                    logger.warning("Dispatch rate limited", extra={"event": "anakin_dispatch_rate_limited", "action_id": action_id, "attempt": dispatch_attempts, "wait_time": wait_time, "category": category})
                    time.sleep(wait_time)
                    continue

                logger.error("Anakin dispatch returned error status", extra={"event": "anakin_dispatch_error", "action_id": action_id, "status": response.status_code, "preview": response.text[:300]})
                raise RuntimeError(f"Anakin action {action_id} returned {response.status_code}: {response.text[:300]}")

            except requests.exceptions.Timeout as e:
                category, msg = categorize_exception(e)
                logger.warning("Dispatch timeout", extra={"event": "anakin_dispatch_timeout", "action_id": action_id, "attempt": dispatch_attempts, "category": category, "error": msg})
                time.sleep(2)
                continue
            except requests.exceptions.RequestException as e:
                category, msg = categorize_exception(e)
                logger.error("Network error dispatching Anakin action", extra={"event": "anakin_dispatch_network_error", "action_id": action_id, "attempt": dispatch_attempts, "category": category, "error": msg})
                time.sleep(2)
                continue
            except Exception as e:
                category, msg = categorize_exception(e)
                logger.exception("Unexpected exception during Anakin dispatch", extra={"event": "anakin_dispatch_exception", "action_id": action_id, "attempt": dispatch_attempts, "category": category, "error": msg})
                raise
        else:
            logger.error("Max dispatch attempts exceeded for Anakin action", extra={"event": "anakin_dispatch_failed", "action_id": action_id, "attempts": dispatch_attempts})
            raise RuntimeError(f"Anakin action {action_id} dispatch failed after {dispatch_attempts} attempts")

        # Parse dispatch response
        try:
            data = response.json()
        except Exception as e:
            category, msg = categorize_exception(e)
            logger.error("Failed to parse Anakin dispatch JSON", extra={"event": "anakin_dispatch_parse_error", "action_id": action_id, "category": category, "error": msg, "response_preview": response.text[:400]})
            raise

        if "job_id" not in data:
            logger.info("Anakin returned inline results (no job_id)", extra={"event": "anakin_inline_results", "action_id": action_id})
            return self._parse_anakin_results(data)

        poll_url = "https://api.anakin.io" + data["poll_url"]
        logger.info("Polling Anakin job", extra={"event": "anakin_poll_start", "action_id": action_id, "poll_url": poll_url})

        # Polling loop with telemetry
        for i in range(12):
            wait_time = min(1 + i * 0.5, 10)
            time.sleep(wait_time)
            try:
                logger.debug("Polling Anakin job", extra={"event": "anakin_poll_attempt", "action_id": action_id, "attempt": i + 1})
                poll_res = requests.get(poll_url, headers={"X-API-Key": ANAKIN_API_KEY}, timeout=10)
                if poll_res.status_code != 200:
                    logger.warning("Poll returned non-200 status", extra={"event": "anakin_poll_status", "action_id": action_id, "status": poll_res.status_code, "attempt": i + 1})
                    continue
                poll_data = poll_res.json()
                status = poll_data.get("status")
                if status == "completed":
                    logger.info("Anakin action completed", extra={"event": "anakin_action_completed", "action_id": action_id, "attempts": i + 1})
                    return self._parse_anakin_results(poll_data)
                if status == "error":
                    logger.error("Anakin action returned error status", extra={"event": "anakin_action_error", "action_id": action_id, "attempt": i + 1, "error": str(poll_data)})
                    raise RuntimeError(f"Anakin action {action_id} failed: {poll_data}")
            except requests.exceptions.Timeout as e:
                category, msg = categorize_exception(e)
                logger.warning("Poll timeout", extra={"event": "anakin_poll_timeout", "action_id": action_id, "attempt": i + 1, "category": category, "error": msg})
            except requests.exceptions.RequestException as e:
                category, msg = categorize_exception(e)
                logger.error("Network error while polling Anakin job", extra={"event": "anakin_poll_network_error", "action_id": action_id, "attempt": i + 1, "category": category, "error": msg})
            except Exception as e:
                category, msg = categorize_exception(e)
                logger.exception("Unexpected exception while polling Anakin job", extra={"event": "anakin_poll_exception", "action_id": action_id, "attempt": i + 1, "category": category, "error": msg})

        logger.error("Anakin action polling timed out", extra={"event": "anakin_poll_timed_out", "action_id": action_id})
        raise TimeoutError(f"Anakin action {action_id} polling timed out")

    def fetch_dynamic_query(self, query: str, max_results: int = 50, prefer_primary: bool = False):
        print(f"Anakin Wire: API key configured: {'yes' if ANAKIN_API_KEY else 'no'}")
        print(f"Anakin Wire: Executing live wire extraction for '{query}'...")
        signals = []
        seen = set()

        def _append_signal(s):
            sig = (s.get("url") or "", s.get("title") or "")
            if sig in seen:
                return False
            seen.add(sig)
            signals.append(s)
            return True

        if ANAKIN_API_KEY:
            for action_id, params in [
                ("google_news_search", {"keyword": query}),
                ("gn_search", {"query": query}),
            ]:
                try:
                    print(f"Anakin Wire: Dispatching live action '{action_id}' for '{query}'...")
                    action_signals = self._run_anakin_action(action_id, params)
                    if action_signals:
                        print(f"Anakin Wire: action '{action_id}' returned {len(action_signals)} signals.")
                        for s in action_signals:
                            if _append_signal(s) and len(signals) >= max_results:
                                break
                except Exception as e:
                    print(f"Anakin Wire action '{action_id}' unavailable: {e}")
                if len(signals) >= max_results:
                    break

        # Public Google News RSS (expanded)
        print(f"Anakin Wire: Querying public live sources for '{query}'...")
        url = f"https://news.google.com/rss/search?q={quote_plus(query)}"
        try:
            res = requests.get(url, timeout=8)
            feed = feedparser.parse(res.content)
            for entry in feed.entries[:min(30, max_results)]:
                s = {
                    "type": "news",
                    "source": "Google News",
                    "title": entry.title,
                    "content": getattr(entry, "summary", ""),
                    "timestamp": datetime.datetime.now().isoformat(),
                    "url": getattr(entry, "link", url)
                }
                if _append_signal(s) and len(signals) >= max_results:
                    break
        except Exception as e:
            print(f"Wire Error fetching dynamic query {query}: {e}")

        # Wikipedia fallback for context
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
                            s = {
                                "type": "encyclopedia",
                                "source": "Wikipedia Deep Index",
                                "title": page_data.get("title", query),
                                "content": page_data["extract"],
                                "timestamp": datetime.datetime.now().isoformat(),
                                "url": f"https://en.wikipedia.org/wiki/{quote_plus(query)}"
                            }
                            if _append_signal(s) and len(signals) >= max_results:
                                break
            except Exception as e:
                print(f"Wire Error fetching Wikipedia for {query}: {e}")

        # Yahoo Finance (company signals)
        print(f"Anakin Wire: Querying Yahoo Finance Integration for '{query}'...")
        try:
            ticker = query.upper()
            if "APPLE" in ticker: ticker = "AAPL"
            elif "MICROSOFT" in ticker: ticker = "MSFT"
            elif "NVIDIA" in ticker: ticker = "NVDA"
            elif "GOOGLE" in ticker or "ALPHABET" in ticker: ticker = "GOOGL"
            elif "TESLA" in ticker: ticker = "TSLA"

            from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeout
            stock = yf.Ticker(ticker)
            info = {}
            executor = ThreadPoolExecutor(max_workers=1)
            future = executor.submit(lambda: stock.info)
            try:
                info = future.result(timeout=3)
            except FuturesTimeout:
                print(f"Anakin Wire: Yahoo Finance timed out for {ticker} (possible datacenter block).")
            except Exception as e:
                print(f"Anakin Wire: Yahoo Finance error for {ticker}: {e}")
            finally:
                executor.shutdown(wait=False)

            if info and "currentPrice" in info:
                price = info.get("currentPrice", "N/A")
                market_cap = info.get("marketCap", "N/A")
                if market_cap != "N/A": market_cap = f"${market_cap/1e9:.2f}B"
                s = {
                    "type": "financial",
                    "source": "Yahoo Finance (Anakin Integration)",
                    "title": f"{ticker} Live Market Data: ${price}",
                    "content": f"Real-time Yahoo Finance data. Price: ${price}. Market Cap: {market_cap}. Day High: ${info.get('dayHigh', 'N/A')}. 52-Week High: ${info.get('fiftyTwoWeekHigh', 'N/A')}. Sector: {info.get('sector', 'N/A')}.",
                    "timestamp": datetime.datetime.now().isoformat(),
                    "url": f"https://finance.yahoo.com/quote/{ticker}"
                }
                _append_signal(s)
        except Exception as e:
            print(f"Wire Error fetching Yahoo Finance for {query}: {e}")

        # arXiv (academic)
        print(f"Anakin Wire: Querying arXiv Academic Integration for '{query}'...")
        try:
            search_q = quote_plus(query)
            arxiv_max = min(5, max_results)
            arxiv_url = f"http://export.arxiv.org/api/query?search_query=all:{search_q}&start=0&max_results={arxiv_max}"
            with urllib.request.urlopen(arxiv_url, timeout=6) as response:
                xml_data = response.read()
                root = ET.fromstring(xml_data)
                for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
                    title = entry.find("{http://www.w3.org/2005/Atom}title").text.replace('\n', ' ')
                    summary = entry.find("{http://www.w3.org/2005/Atom}summary").text.replace('\n', ' ')
                    link = entry.find("{http://www.w3.org/2005/Atom}id").text
                    s = {
                        "type": "academic",
                        "source": "arXiv (Anakin Integration)",
                        "title": f"Academic Research: {title[:80]}...",
                        "content": summary[:600] + "...",
                        "timestamp": datetime.datetime.now().isoformat(),
                        "url": link
                    }
                    if _append_signal(s) and len(signals) >= max_results:
                        break
        except Exception as e:
            print(f"Wire Error fetching arXiv for {query}: {e}")

        # GitHub (developer tooling)
        print(f"Anakin Wire: Querying GitHub Integration for '{query}'...")
        try:
            per_page = min(5, max_results)
            gh_url = f"https://api.github.com/search/repositories?q={quote_plus(query)}&sort=stars&order=desc&per_page={per_page}"
            gh_resp = requests.get(gh_url, headers={"User-Agent": "GodsEyeX"}, timeout=6)
            if gh_resp.status_code == 200:
                items = gh_resp.json().get("items", [])
                for item in items:
                    s = {
                        "type": "code",
                        "source": "GitHub (Anakin Integration)",
                        "title": f"Open Source: {item.get('full_name')}",
                        "content": f"{item.get('description', 'No description')} - Stars: {item.get('stargazers_count')} - Language: {item.get('language')}",
                        "timestamp": datetime.datetime.now().isoformat(),
                        "url": item.get("html_url")
                    }
                    if _append_signal(s) and len(signals) >= max_results:
                        break
        except Exception as e:
            print(f"Wire Error fetching GitHub for {query}: {e}")

        # Append real Polymarket data
        pm_data = self.fetch_polymarket_signals(query)
        for pm in pm_data:
            if _append_signal(pm) and len(signals) >= max_results:
                break

        if prefer_primary:
            priority = ["academic", "financial", "code", "encyclopedia", "news", "polymarket"]
            signals.sort(key=lambda s: priority.index(s.get("type")) if s.get("type") in priority else len(priority))

        return signals[:max_results]

wire_engine = WireIngestionEngine()
