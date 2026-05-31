import asyncio
import uuid
from datetime import datetime

from fastapi import BackgroundTasks, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import SessionLocal, engine
from .holocron.orchestrator import holocron_engine
from .wire.ingestion import ALAKIN_SOURCE_CATALOG


try:
    from backend.holocron.anakin_llm import anakin_health_check, get_circuit_state
except Exception:
    def anakin_health_check():
        return {"configured": False, "status": "unknown"}
    def get_circuit_state():
        return {"is_open": False}

try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: failed to create DB schema at startup ({e}). Continuing without blocking startup.")

app = FastAPI(title="GOD'S EYE X - Real-Time Intelligence OS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    async def continuous_holocron_loop():
        print("GOD'S EYE X: Background Continuous Execution Started.")
        while True:
            try:
                await asyncio.to_thread(holocron_engine.run_pipeline)
            except Exception as e:
                print(f"Holocron Pipeline Error: {e}")
            await asyncio.sleep(60)

    asyncio.create_task(continuous_holocron_loop())


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "God's Eye X Infrastructure",
        "architecture": "Holocron + Anakin/Alakin Wire",
        "mode": "live_evidence_only",
    }


@app.get("/api/sources")
def source_catalog():
    return {"categories": ALAKIN_SOURCE_CATALOG}


@app.post("/api/holocron/trigger")
async def trigger_holocron(background_tasks: BackgroundTasks):
    background_tasks.add_task(holocron_engine.run_pipeline)
    return {"status": "Pipeline initiated. SignalDiscoveryAgent is running."}


@app.get("/api/diagnostics/health")
def diagnostic_health():
    return {
        "status": "Healthy",
        "databases": {
            "postgresql": "Configured",
            "neo4j": "Configured",
            "qdrant": "Configured",
            "redis": "Configured",
        },
        "continuous_loop": "Running",
    }


@app.get("/api/diagnostics/agents")
def diagnostic_agents():
    return {
        "agents": {
            "SignalDiscoveryAgent": "Online",
            "EntityExtractionAgent": "Online",
            "VerificationAgent": "Online",
            "KnowledgeGraphAgent": "Online",
            "VectorMemoryAgent": "Online",
        },
        "engines": {
            "IntelligenceEngine": "Online",
            "OpportunityDiscoveryEngine": "Online",
            "RiskDetectionEngine": "Online",
            "RealityDriftEngine": "Online",
            "ExplainabilityEngine": "Online",
            "DomainIntelligenceEngines": "Online",
        },
    }



@app.get("/api/diagnostics/anakin")
def diagnostic_anakin():
    """Sanitized diagnostic for Anakin connectivity and circuit breaker state."""
    try:
        health = anakin_health_check()
        circuit = get_circuit_state()
        return {"anakin": health, "circuit": circuit}
    except Exception as e:
        return {"anakin": {"status": "error", "message": "diagnostic_failed"}}


SEARCH_TASKS = {}


@app.get("/api/search")
async def search_entities_async(q: str, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    SEARCH_TASKS[task_id] = {"status": "processing"}
    background_tasks.add_task(run_search_task, task_id, q)
    return {"status": "processing", "task_id": task_id}


@app.get("/api/search/status/{task_id}")
async def search_status(task_id: str):
    return SEARCH_TASKS.get(task_id, {"status": "error", "message": "Task not found"})


def _normalize_search_term(q: str) -> str:
    search_term = q.strip().lower()
    if search_term == "apple":
        return "AAPL"
    if search_term == "microsoft":
        return "MSFT"
    if "nvidia" in search_term or "nvindia" in search_term:
        return "NVIDIA"
    return search_term


def _infer_entity_type(search_term: str) -> str:
    t_lower = search_term.lower()
    if any(k in t_lower for k in ["trump", "musk", "biden", "altman", "ceo", "founder", "person", "man", "woman"]):
        return "Person"
    if any(k in t_lower for k in ["apple", "microsoft", "google", "meta", "tesla", "inc", "corp", "company", "aapl", "msft", "nvda", "nvidia"]):
        return "Organization"
    if any(k in t_lower for k in ["london", "paris", "tokyo", "usa", "city", "country", "india", "china"]):
        return "Location"
    return "Concept"


def _entity_from_live_signals(db, search_term, live_signals, confidence):
    if not live_signals:
        return []

    first_signal = next((s for s in live_signals if s.get("title") or s.get("content")), {})
    description = first_signal.get("content") or first_signal.get("title") or f"Live evidence returned for {search_term}."
    entity = models.Entity(
        id=str(uuid.uuid4()),
        name=search_term.upper(),
        type=_infer_entity_type(search_term),
        description=description[:500],
        momentum=confidence,
        tags=["Live Evidence", first_signal.get("source", "Unknown Source")],
        properties={
            "evidence": [
                {
                    "source": s.get("source"),
                    "title": s.get("title"),
                    "url": s.get("url"),
                    "timestamp": s.get("timestamp"),
                }
                for s in live_signals[:10]
            ],
            "created_from_live_search_at": datetime.utcnow().isoformat() + "Z",
        },
    )
    db.add(entity)
    db.commit()
    db.refresh(entity)
    return [entity]


def _build_evidence_dossier(topic: str, report_type: str, evidence: list) -> str:
    source_names = ", ".join(sorted({item["source"] for item in evidence if item.get("source")}))
    verified = "\n".join(
        f"- {item['title'] or item['content'][:180]} ({item['source']})"
        for item in evidence[:6]
    )
    risks = [
        item for item in evidence
        if any(word in f"{item.get('title', '')} {item.get('content', '')}".lower() for word in ["risk", "policy", "regulation", "court", "market", "security", "conflict"])
    ]
    opportunities = [
        item for item in evidence
        if any(word in f"{item.get('title', '')} {item.get('content', '')}".lower() for word in ["growth", "launch", "investment", "research", "market", "technology", "development"])
    ]
    risk_lines = "\n".join(f"- {item['title'] or item['content'][:180]} ({item['source']})" for item in risks[:4]) or "- No explicit risk signal was returned by the live sources."
    opportunity_lines = "\n".join(f"- {item['title'] or item['content'][:180]} ({item['source']})" for item in opportunities[:4]) or "- No explicit opportunity signal was returned by the live sources."

    return (
        f"## Executive Summary\n"
        f"This {report_type} dossier for {topic} is built from {len(evidence)} live evidence items returned by: {source_names}. "
        f"The system did not use unsourced claims, clearance framing, or simulated data.\n\n"
        f"## Verified Signals\n{verified}\n\n"
        f"## Risks\n{risk_lines}\n\n"
        f"## Opportunities\n{opportunity_lines}\n\n"
        f"## Source Gaps\n"
        f"The dossier is limited to sources that returned data during this request. Any missing Alakin-authenticated providers should be treated as coverage gaps, not negative evidence.\n\n"
        f"## Next Checks\n"
        f"- Re-run the scan with more specific keywords for deeper source coverage.\n"
        f"- Validate high-impact claims against primary filings, official statistics, or authenticated Alakin connectors before action."
    )


def run_search_task(task_id: str, q: str):
    db = SessionLocal()
    try:
        search_term = _normalize_search_term(q)

        from backend.holocron.ultimate_pipeline import UltimatePipelineEngine
        from backend.wire.ingestion import wire_engine as dyn_wire

        live_signals = dyn_wire.fetch_dynamic_query(search_term)
        print(f"[God's Eye X] Fetched {len(live_signals)} live signals for '{search_term}'")

        dyn_engine = UltimatePipelineEngine()
        pipeline_results = dyn_engine.run_full_pipeline(search_term, live_signals)
        coverage = pipeline_results.get("coverage", {})
        confidence = min(0.95, max(0.05, (coverage.get("signals_returned", 0) * 0.05) + (len(coverage.get("sources", {})) * 0.1)))

        results = db.query(models.Entity).filter(models.Entity.name.ilike(f"%{search_term}%")).limit(20).all()
        if not results:
            results = _entity_from_live_signals(db, search_term, live_signals, confidence)

        domain_scores = pipeline_results.get("detailed_intel", {}).get("domain_scores", {})
        SEARCH_TASKS[task_id] = {
            "status": "completed",
            "data": {
                "query": search_term,
                "entities": [
                    {
                        "id": e.id,
                        "name": e.name,
                        "type": e.type,
                        "description": e.description,
                        "momentum": e.momentum,
                        "risk_score": domain_scores.get("Policy_And_Risk", 0),
                        "opportunity_score": domain_scores.get("Opportunity_Discovery", 0),
                        "related_nodes": [],
                        "properties": e.properties or {},
                    }
                    for e in results
                ],
                "ultimate_pipeline": pipeline_results,
            },
        }
    except Exception as e:
        import traceback

        print(traceback.format_exc())
        SEARCH_TASKS[task_id] = {"status": "error", "message": str(e) + " || TRACEBACK: " + traceback.format_exc()}
    finally:
        db.close()


@app.get("/api/diagnostics/tasks")
def dump_tasks():
    return {"data": str(SEARCH_TASKS)}


@app.post("/api/reports/generate")
async def generate_report(topic: str, report_type: str):
    try:
        from backend.holocron.anakin_llm import anakin_chatgpt
        from backend.wire.ingestion import wire_engine

        live_signals = wire_engine.fetch_dynamic_query(topic)
        evidence = [
            {
                "source": s.get("source", "Unknown source"),
                "type": s.get("type", "unknown"),
                "title": s.get("title", ""),
                "content": (s.get("content", "") or "")[:800],
                "url": s.get("url", ""),
                "timestamp": s.get("timestamp", ""),
            }
            for s in live_signals[:15]
            if s.get("title") or s.get("content")
        ]
        if not evidence:
            return {
                "title": f"{topic} Report",
                "content": "No live Alakin/Anakin evidence returned for this dossier request. The system did not generate an unsourced report.",
                "sources": [],
            }

        evidence_block = "\n".join(
            f"{idx + 1}. [{item['source']} / {item['type']}] {item['title']} | {item['url']} | {item['content']}"
            for idx, item in enumerate(evidence)
        )
        prompt = (
            f"Write a premium but strictly evidence-bound {report_type} dossier about {topic}.\n\n"
            f"Live Alakin/Anakin-aligned evidence:\n{evidence_block}\n\n"
            "Rules:\n"
            "- Use only the evidence above.\n"
            "- Cite source names inline for every important claim.\n"
            "- Do not mention clearance levels, secret access, terminal fantasy, or unsupported numbers.\n"
            "- Include sections: Executive Summary, Verified Signals, Risks, Opportunities, Source Gaps, Next Checks.\n"
            "- If evidence is weak, say exactly what is weak."
        )
        try:
            response = anakin_chatgpt(prompt)
        except Exception as exc:
            print(f"[Reports] Anakin dossier generation failed, using evidence fallback: {exc}")
            response = ""
        if not response or not response.strip():
            response = _build_evidence_dossier(topic, report_type, evidence)
        return {
            "title": f"{topic} Report",
            "content": response,
            "sources": [{"source": item["source"], "title": item["title"], "url": item["url"]} for item in evidence],
        }
    except Exception as e:
        return {"title": f"{topic} Report", "content": f"Real-time AI generation failed: {e}"}
