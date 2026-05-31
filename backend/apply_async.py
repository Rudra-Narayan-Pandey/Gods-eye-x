import re
import os

MAIN_PY = r"c:\new hackathon 29-05-2026\backend\main.py"
with open(MAIN_PY, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add BackgroundTasks and uuid import
if "from fastapi import BackgroundTasks" not in content:
    content = content.replace("from fastapi import FastAPI, Depends", "from fastapi import FastAPI, Depends, BackgroundTasks\nimport uuid")

# 2. Add global dict
if "SEARCH_TASKS = {}" not in content:
    content = content.replace("holocron_engine = UltimatePipelineEngine()", "holocron_engine = UltimatePipelineEngine()\nSEARCH_TASKS = {}")

# 3. Refactor /api/search
search_logic = """
@app.get("/api/search")
async def search_entities_async(q: str, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    SEARCH_TASKS[task_id] = {"status": "processing"}
    background_tasks.add_task(run_search_task, task_id, q)
    return {"status": "processing", "task_id": task_id}

@app.get("/api/search/status/{task_id}")
async def search_status(task_id: str):
    return SEARCH_TASKS.get(task_id, {"status": "error", "message": "Task not found"})

def run_search_task(task_id: str, q: str):
    db = SessionLocal()
    try:
        search_term = q.lower()
        if search_term == "apple":
            search_term = "AAPL"
        elif search_term == "microsoft":
            search_term = "MSFT"
        elif "nvidia" in search_term or "nvindia" in search_term:
            search_term = "NVIDIA"
            
        results = db.query(models.Entity).filter(models.Entity.name.ilike(f"%{search_term}%")).limit(20).all()
        
        if not results:
            print(f"No results found in DB. Triggering dynamic pipeline for {search_term}...")
            holocron_engine.run_dynamic_pipeline(search_term)
            results = db.query(models.Entity).filter(models.Entity.name.ilike(f"%{search_term}%")).limit(20).all()
            
            if not results:
                t_lower = search_term.lower()
                entity_type = "Concept"
                if any(k in t_lower for k in ["trump", "musk", "biden", "altman", "ceo", "founder", "person", "man", "woman"]):
                    entity_type = "Person"
                elif any(k in t_lower for k in ["apple", "microsoft", "google", "meta", "tesla", "inc", "corp", "company"]):
                    entity_type = "Organization"
                elif any(k in t_lower for k in ["london", "paris", "tokyo", "usa", "city", "country", "india", "china"]):
                    entity_type = "Location"

                new_entity = models.Entity(
                    name=search_term.upper(),
                    type=entity_type,
                    description=f"Auto-generated intelligence node for {search_term}",
                    risk_score=75,
                    opportunity_score=80
                )
                db.add(new_entity)
                db.commit()
                db.refresh(new_entity)
                results = [new_entity]

        from backend.holocron.ultimate_pipeline import UltimatePipelineEngine
        dyn_engine = UltimatePipelineEngine()
        pipeline_results = dyn_engine.run_full_pipeline(search_term, [])

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
                        "risk_score": e.risk_score,
                        "opportunity_score": e.opportunity_score,
                        "related_nodes": e.related_nodes
                    } for e in results
                ],
                "ultimate_pipeline": pipeline_results
            }
        }
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        SEARCH_TASKS[task_id] = {"status": "error", "message": str(e)}
    finally:
        db.close()
"""

# Regex to remove the existing @app.get("/api/search")
content = re.sub(r'@app\.get\("/api/search"\)\ndef search_entities.*?(?=@app\.post\("/api/reports/generate"\))', search_logic + "\n", content, flags=re.DOTALL)

with open(MAIN_PY, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated main.py successfully.")
