import sys
import json
import time
from holocron.anakin_llm import anakin_chatgpt

query = "america"
news_context = "america is experiencing a major economic boom"

prompt = f"""You are the God's Eye intelligence engine. Analyze the following live news data about '{query}':
{news_context}

Generate a strictly valid JSON object (no markdown, no backticks) with the following structure, using ONLY real, highly analytical, factual intelligence derived from the news. Do NOT use fake framing like '[CAPITAL INFLOW DETECTED]'. Make it read like a premium, top-tier Wall Street / Intelligence dossier.

{{
    "startup_intelligence": {{
        "momentum_score": (number 1-100),
        "funding_events": [{{"event": "Factual sentence about capital movement", "confidence": 0.95}}],
        "hiring_anomalies": [{{"role": "Role Name", "signal": "Factual sentence about hiring or talent"}}],
        "hypergrowth_detected": true/false
    }},
    "technology_intelligence": {{
        "emerging_tech": [{{"tech": "Factual sentence about tech adoption", "adoption_velocity": "High/Medium/Low"}}],
        "patent_signals": [{{"description": "Factual sentence about IP or algorithms"}}]
    }},
    "policy_and_risk": {{
        "policy_risks": [{{"risk": "Factual sentence about regulation", "severity": "CRITICAL/HIGH/MEDIUM"}}],
        "market_risks": [{{"risk": "Factual sentence about market volatility", "severity": "HIGH/MEDIUM"}}],
        "supply_chain_risks": [{{"risk": "Factual sentence about supply chain", "severity": "HIGH/MEDIUM"}}]
    }},
    "opportunity_discovery": {{
        "market_gaps": [{{"gap": "Factual sentence about a market gap", "potential": "Factual yield potential", "proof": "Factual proof from news"}}],
        "hidden_opportunities": [{{"desc": "Factual hidden opportunity", "score": 0.95}}]
    }},
    "reality_drift": {{
        "fake_news_detected": [{{"claim": "A narrative circulating", "debunk": "Factual debunking based on data"}}],
        "verified_truth": [{{"fact": "A verified hard fact", "source": "News source"}}]
    }},
    "ultimate_summary": {{
        "what_is_happening": "Factual summary of current situation",
        "why_it_is_happening": "Factual analysis of the catalysts",
        "what_next": "Factual prediction of the immediate trajectory",
        "horizon_20_year": {{
            "2026": "A concise, highly intellectual 1-sentence IAS-style geopolitical prediction for 2026.",
            "2027": "A concise, highly intellectual 1-sentence IAS-style geopolitical prediction for 2027.",
            "...": "CONTINUE GENERATING EVERY SINGLE YEAR INDIVIDUALLY UNTIL 2046... Keep each year extremely concise (1 sentence maximum) to ensure rapid API generation, but keep the geopolitical vocabulary incredibly premium.",
            "2046": "A concise, highly intellectual 1-sentence IAS-style geopolitical prediction for 2046."
        }}
    }}
}}"""

print("Sending concise prompt to Anakin...")
start = time.time()
try:
    response = anakin_chatgpt(prompt, max_retries=60)
    print(f"Received in {time.time()-start:.2f}s")
    print(response[:500])
except Exception as e:
    print(f"Error: {e}")
