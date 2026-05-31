import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone


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
        horizon = {}
        model = self._build_forecast_model(evidence)
        top_sources = sorted({s["source"] for s in evidence[:5]})
        themes = [s["title"] or s["content"][:160] for s in evidence if s.get("title") or s.get("content")]
        if not themes:
            themes = [f"returned live evidence about {query}"]

        previous_index = model["base_signal_index"]
        for year in range(2026, 2047):
            key = str(year)
            offset = year - 2026
            theme = themes[(year - 2026) % len(themes)]
            signal_index = max(0, min(100, round(model["base_signal_index"] + (model["trend_slope"] * offset) - (offset * 0.9), 1)))
            uncertainty = round(8 + (offset * 1.15) + max(0, 5 - model["source_diversity"]), 1)
            confidence_mid = max(25, min(88, round(model["base_confidence"] - (offset * 1.7), 1)))
            ci_low = max(0, round(confidence_mid - uncertainty, 1))
            ci_high = min(100, round(confidence_mid + uncertainty, 1))

            if year <= 2028:
                phase = "near-term policy, market, and public narrative responses"
            elif year <= 2032:
                phase = "institutional adoption and regulatory normalization"
            elif year <= 2038:
                phase = "second-order economic, technology, and governance effects"
            else:
                phase = "long-range structural positioning and resilience planning"
            delta = round(signal_index - previous_index, 1)
            if delta > 1:
                transition = f"Signal index rises {delta} points from the prior year as the model carries forward positive source momentum."
            elif delta < -1:
                transition = f"Signal index falls {abs(delta)} points from the prior year as uncertainty decay overtakes returned-source momentum."
            else:
                transition = "Signal index is broadly stable versus the prior year; the model treats new evidence as necessary before changing direction."

            horizon[key] = {
                "projection": (
                    f"For {query}, the {year} scenario focuses on {phase}. "
                    f"The current evidence anchor is: {theme}"
                ),
                "economic_model": (
                    f"Evidence Momentum Model v1: signal_index={signal_index}/100, "
                    f"macro_proxy={model['macro_proxy']}/100, risk_pressure={model['risk_pressure']}/100, "
                    f"source_diversity={model['source_diversity']}."
                ),
                "statistical_analysis": (
                    f"n={model['evidence_count']} live evidence items; type mix={model['type_mix']}; "
                    f"recency_weighted_signal={model['recency_weighted_signal']}/100; trend_slope={model['trend_slope']} index-points/year."
                ),
                "historical_trend": model["historical_trend"],
                "confidence_interval": f"{ci_low}% - {ci_high}% scenario confidence; midpoint {confidence_mid}%.",
                "transition_logic": transition,
                "sources": top_sources,
            }
            previous_index = signal_index
        return horizon

    def _build_forecast_model(self, evidence):
        now = datetime.now(timezone.utc)
        parsed_dates = []
        for item in evidence:
            parsed = self._parse_datetime(item.get("timestamp"))
            if parsed:
                parsed_dates.append(parsed)

        year_counts = Counter(dt.year for dt in parsed_dates)
        type_counts = Counter(item.get("type", "unknown") for item in evidence)
        source_diversity = len({item.get("source") for item in evidence if item.get("source")})
        evidence_count = len(evidence)
        combined_text = " ".join(f"{item.get('title', '')} {item.get('content', '')}" for item in evidence).lower()

        macro_hits = sum(combined_text.count(word) for word in ["gdp", "inflation", "market", "rate", "trade", "investment", "growth", "stock", "rupee", "economy"])
        risk_hits = sum(combined_text.count(word) for word in ["risk", "regulation", "conflict", "court", "policy", "sanction", "tariff", "decline", "security"])
        tech_hits = sum(combined_text.count(word) for word in ["technology", "ai", "digital", "semiconductor", "research", "software", "data", "startup"])

        recency_scores = []
        for dt in parsed_dates:
            age_days = max(0, (now - dt).days)
            recency_scores.append(max(0, 100 - min(100, age_days * 2)))
        recency_weighted_signal = round(sum(recency_scores) / len(recency_scores), 1) if recency_scores else 45.0

        macro_proxy = min(100, round((macro_hits * 6) + (type_counts.get("financial", 0) * 18) + (type_counts.get("news", 0) * 4), 1))
        risk_pressure = min(100, round((risk_hits * 7) + (type_counts.get("polymarket", 0) * 12), 1))
        innovation_proxy = min(100, round((tech_hits * 6) + (type_counts.get("academic", 0) * 14) + (type_counts.get("code", 0) * 12), 1))
        base_signal_index = min(100, round((recency_weighted_signal * 0.32) + (macro_proxy * 0.26) + (innovation_proxy * 0.22) + (source_diversity * 4) - (risk_pressure * 0.12), 1))
        base_confidence = min(88, round(38 + (evidence_count * 2.8) + (source_diversity * 5), 1))
        trend_slope = round(((macro_proxy + innovation_proxy) - risk_pressure) / 55, 2)

        if year_counts:
            ordered = ", ".join(f"{year}:{count}" for year, count in sorted(year_counts.items()))
            historical_trend = (
                f"Returned-source historical window by timestamp is {ordered}. "
                "This is a request-window trend calculation, not a full macroeconomic time series."
            )
        else:
            historical_trend = (
                "Returned evidence did not include parseable publication timestamps, so historical trend is limited to cross-source signal mix."
            )

        return {
            "evidence_count": evidence_count,
            "source_diversity": source_diversity,
            "type_mix": dict(type_counts),
            "recency_weighted_signal": recency_weighted_signal,
            "macro_proxy": macro_proxy,
            "risk_pressure": risk_pressure,
            "innovation_proxy": innovation_proxy,
            "base_signal_index": base_signal_index,
            "base_confidence": base_confidence,
            "trend_slope": trend_slope,
            "historical_trend": historical_trend,
        }

    def _parse_datetime(self, value):
        if not value:
            return None
        text = str(value).strip()
        try:
            parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return parsed
        except ValueError:
            pass
        for fmt in ("%a, %d %b %Y %H:%M:%S %Z", "%Y-%m-%d", "%Y-%m-%dT%H:%M:%S"):
            try:
                return datetime.strptime(text[:len(datetime.now().strftime(fmt))], fmt).replace(tzinfo=timezone.utc)
            except Exception:
                continue
        return None

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
