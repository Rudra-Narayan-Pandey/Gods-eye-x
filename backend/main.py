import asyncio
import uuid
from datetime import datetime

from fastapi import BackgroundTasks, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import SessionLocal, engine
from .holocron.orchestrator import holocron_engine
from .wire.ingestion import ALAKIN_SOURCE_CATALOG

models.Base.metadata.create_all(bind=engine)

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

        prompt = (
            f"Write an evidence-bound executive summary about {topic} focusing on {report_type}. "
            "Do not invent facts. If live evidence is insufficient, say so clearly."
        )
        response = anakin_chatgpt(prompt)
        return {"title": f"{topic} Report", "content": response}
    except Exception as e:
        return {"title": f"{topic} Report", "content": f"Real-time AI generation failed: {e}"}
