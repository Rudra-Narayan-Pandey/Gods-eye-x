import json
import re
from collections import Counter, defaultdict
from datetime import datetime


class UltimatePipelineEngine:
    def __init__(self):
        pass

    def run_full_pipeline(self, query: str, signals: list):
        """
        Build an intelligence payload only from evidence returned by live wire
        sources. If a source did not return data, it is reported as absent
        instead of being simulated.
        """
        clean_signals = [self._normalize_signal(s) for s in signals if self._is_usable_signal(s)]
        evidence = clean_signals[:20]
        source_counts = Counter(s["source"] for s in evidence)
        type_counts = Counter(s["type"] for s in evidence)

        if not evidence:
            return self._empty_payload(query)

        ai_payload = self._try_anakin_synthesis(query, evidence)
        if ai_payload:
            detailed_intel = ai_payload
        else:
            detailed_intel = self._grounded_synthesis(query, evidence)

        summary = detailed_intel.get("ultimate_summary", {})
        trace = self._build_trace(query, evidence, source_counts)

        return {
            "trace": trace,
            "detailed_intel": detailed_intel,
            "ultimate_summary": summary,
            "evidence": evidence,
            "coverage": {
                "signals_returned": len(evidence),
                "sources": dict(source_counts),
                "types": dict(type_counts),
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "mode": "live_evidence_only",
            },
        }

    def _is_usable_signal(self, signal):
        return bool(signal and (signal.get("title") or signal.get("content")) and signal.get("source"))

    def _normalize_signal(self, signal):
        title = self._clean_text(signal.get("title", ""))
        content = self._clean_text(signal.get("content", ""))
        return {
            "type": signal.get("type", "unknown"),
            "source": signal.get("source", "Unknown source"),
            "title": title,
            "content": content,
            "timestamp": signal.get("timestamp") or datetime.utcnow().isoformat() + "Z",
            "url": signal.get("url", ""),
            "raw": {k: v for k, v in signal.items() if k not in {"title", "content"}},
        }

    def _clean_text(self, value):
        return re.sub(r"\s+", " ", str(value or "")).strip()

    def _try_anakin_synthesis(self, query, evidence):
        try:
            from backend.holocron.anakin_llm import anakin_chatgpt

            context = "\n".join(
                f"{idx + 1}. source={s['source']} type={s['type']} title={s['title']} url={s['url']} content={s['content'][:500]}"
                for idx, s in enumerate(evidence[:12])
            )
            prompt = f"""
You are an evidence-bound intelligence analyst.
Query: {query}
Live evidence:
{context}

Return strictly valid JSON with these keys:
domain_scores, startup_intelligence, technology_intelligence, policy_and_risk,
opportunity_discovery, reality_drift, ultimate_summary.

Rules:
- Use only facts present in the evidence above.
- Do not invent statistics, secret access, terminal language, or unobserved sources.
- If evidence is insufficient for a section, return an empty list or a sentence saying the live evidence is insufficient.
- Include source names inside each claim when possible.
- ultimate_summary.horizon_20_year is required. It must include string keys "2026" through "2046".
- Each horizon year must be an evidence-bound analyst scenario based on the live evidence, phrased as "If the current live signals persist..." or "Based on returned source coverage...", not as a guaranteed fact.
- Each horizon year must cite at least one source name from the live evidence.
"""
            response = anakin_chatgpt(prompt, max_retries=12)
            json_str = response.strip()
            if "```json" in json_str:
                json_str = json_str.split("```json", 1)[1].split("```", 1)[0].strip()
            elif "```" in json_str:
                json_str = json_str.split("```", 1)[1].split("```", 1)[0].strip()
            parsed = json.loads(json_str)
            parsed["synthesis_mode"] = "anakin_live_evidence_bound"
            parsed["polymarket_data"] = [s for s in evidence if s.get("type") == "polymarket"]
            parsed.setdefault("ultimate_summary", {})
            parsed["ultimate_summary"]["horizon_20_year"] = self._complete_horizon(
                query,
                evidence,
                parsed["ultimate_summary"].get("horizon_20_year", {}),
            )
            return parsed
        except Exception as exc:
            print(f"[God's Eye X] Evidence-bound Anakin synthesis unavailable: {exc}")
            return None

    def _grounded_synthesis(self, query, evidence):
        by_type = defaultdict(list)
        for item in evidence:
            by_type[item["type"]].append(item)

        source_diversity = len({s["source"] for s in evidence})
        confidence = min(95, 45 + len(evidence) * 4 + source_diversity * 6)
        news = by_type.get("news", []) + by_type.get("encyclopedia", [])
        finance = by_type.get("financial", [])
        academic = by_type.get("academic", [])
        code = by_type.get("code", [])
        markets = by_type.get("polymarket", [])

        def claim_items(items, key_name, max_items=4):
            output = []
            for item in items[:max_items]:
                text = item["title"] or item["content"]
                output.append({
                    key_name: text,
                    "source": item["source"],
                    "url": item["url"],
                    "confidence": round(confidence / 100, 2),
                })
            return output

        verified_truth = [
            {"fact": item["title"] or item["content"][:220], "source": item["source"], "url": item["url"]}
            for item in evidence[:6]
        ]

        summary = self._summary(query, evidence)
        return {
            "synthesis_mode": "deterministic_live_evidence_only",
            "domain_scores": {
                "Evidence_Coverage": confidence,
                "Source_Diversity": min(100, source_diversity * 20),
                "News_Wire": min(100, len(news) * 15),
                "Market_Data": min(100, (len(finance) + len(markets)) * 30),
                "Research_And_Code": min(100, (len(academic) + len(code)) * 25),
            },
            "startup_intelligence": {
                "momentum_score": confidence,
                "funding_events": claim_items(finance + news, "event"),
                "hiring_anomalies": [],
                "hypergrowth_detected": False,
            },
            "technology_intelligence": {
                "emerging_tech": [
                    {"tech": item["title"], "adoption_velocity": "Observed in live source", "source": item["source"], "url": item["url"]}
                    for item in (academic + code + news)[:5]
                ],
                "patent_signals": [],
            },
            "policy_and_risk": {
                "policy_risks": claim_items(
                    [s for s in evidence if self._contains_any(s, ["policy", "regulation", "law", "government", "risk", "court"])],
                    "risk",
                ),
                "market_risks": claim_items(finance + markets, "risk"),
                "supply_chain_risks": claim_items(
                    [s for s in evidence if self._contains_any(s, ["supply", "shipment", "logistics", "tariff", "manufacturing"])],
                    "risk",
                ),
            },
            "opportunity_discovery": {
                "market_gaps": [
                    {
                        "gap": item["title"],
                        "potential": "Requires analyst review; live evidence does not quantify upside.",
                        "proof": item["source"],
                        "url": item["url"],
                    }
                    for item in (finance + academic + code + news)[:4]
                ],
                "hidden_opportunities": [
                    {"desc": item["title"], "score": round(confidence / 100, 2), "source": item["source"], "url": item["url"]}
                    for item in evidence[:4]
                ],
            },
            "reality_drift": {
                "fake_news_detected": [],
                "verified_truth": verified_truth,
            },
            "polymarket_data": markets,
            "ultimate_summary": summary,
        }

    def _complete_horizon(self, query, evidence, existing=None):
        existing = existing or {}
        horizon = {}
        top_sources = ", ".join(sorted({s["source"] for s in evidence[:5]}))
        themes = [s["title"] or s["content"][:160] for s in evidence if s.get("title") or s.get("content")]
        if not themes:
            themes = [f"returned live evidence about {query}"]

        for year in range(2026, 2047):
            key = str(year)
            supplied = existing.get(key)
            if supplied and isinstance(supplied, str) and supplied.strip():
                horizon[key] = supplied.strip()
                continue

            theme = themes[(year - 2026) % len(themes)]
            if year <= 2028:
                phase = "near-term policy, market, and public narrative responses"
            elif year <= 2032:
                phase = "institutional adoption and regulatory normalization"
            elif year <= 2038:
                phase = "second-order economic, technology, and governance effects"
            else:
                phase = "long-range structural positioning and resilience planning"
            horizon[key] = (
                f"Based on returned source coverage from {top_sources}, the {year} scenario for {query} should monitor "
                f"{phase}; the current evidence anchor is: {theme}"
            )
        return horizon

    def _contains_any(self, signal, words):
        text = f"{signal.get('title', '')} {signal.get('content', '')}".lower()
        return any(word in text for word in words)

    def _summary(self, query, evidence):
        top = evidence[0]
        sources = ", ".join(sorted({s["source"] for s in evidence[:8]}))
        supporting = evidence[1]["title"] if len(evidence) > 1 else "No second live signal was returned."
        third = evidence[2]["title"] if len(evidence) > 2 else "Additional corroboration is still needed."
        return {
            "what_is_happening": f"Live sources returned {len(evidence)} evidence items for {query}. The leading signal is from {top['source']}: {top['title'] or top['content'][:220]}.",
            "why_it_is_happening": f"The current read is based on returned source coverage across {sources}. Supporting signal: {supporting}",
            "what_next": f"Monitor for corroboration from additional Alakin/live sources before making a stronger forecast. Next useful signal to verify: {third}",
            "horizon_20_year": self._complete_horizon(query, evidence),
            "opportunities": [s["title"] for s in evidence[:3] if s["title"]],
            "risks": [s["title"] for s in evidence if self._contains_any(s, ["risk", "regulation", "lawsuit", "decline"])][:3],
        }

    def _build_trace(self, query, evidence, source_counts):
        trace = [
            f"[Search] Query accepted: {query}",
            f"[Wire] Received {len(evidence)} live evidence items.",
        ]
        for source, count in source_counts.items():
            trace.append(f"[Source] {source}: {count} item(s) returned.")
        for idx, item in enumerate(evidence[:20], start=1):
            title = (item["title"] or item["content"])[:140]
            trace.append(f"[Evidence {idx:02d}] {item['source']} / {item['type']}: {title}")
        trace.append("[Synthesis] Completed with live evidence only; no simulated data injected.")
        return trace

    def _empty_payload(self, query):
        summary = {
            "what_is_happening": f"No live evidence was returned for {query}.",
            "why_it_is_happening": "The configured Anakin/public sources did not return usable data within the request window.",
            "what_next": "Retry with a more specific query or enable additional authenticated Alakin/Anakin connectors.",
            "horizon_20_year": {},
            "opportunities": [],
            "risks": [],
        }
        return {
            "trace": [
                f"[Search] Query accepted: {query}",
                "[Wire] No live evidence returned.",
                "[Synthesis] Stopped without fabricating fallback intelligence.",
            ],
            "detailed_intel": {
                "synthesis_mode": "no_live_evidence",
                "domain_scores": {},
                "startup_intelligence": {"momentum_score": 0, "funding_events": [], "hiring_anomalies": [], "hypergrowth_detected": False},
                "technology_intelligence": {"emerging_tech": [], "patent_signals": []},
                "policy_and_risk": {"policy_risks": [], "market_risks": [], "supply_chain_risks": []},
                "opportunity_discovery": {"market_gaps": [], "hidden_opportunities": []},
                "reality_drift": {"fake_news_detected": [], "verified_truth": []},
                "polymarket_data": [],
                "ultimate_summary": summary,
            },
            "ultimate_summary": summary,
            "evidence": [],
            "coverage": {"signals_returned": 0, "sources": {}, "types": {}, "mode": "live_evidence_only"},
        }


ultimate_pipeline = UltimatePipelineEngine()
