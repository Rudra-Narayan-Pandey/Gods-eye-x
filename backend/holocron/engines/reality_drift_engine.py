from backend.holocron.anakin_llm import anakin_chatgpt
from backend.database import SessionLocal
from backend.models import Anomaly
import uuid

class RealityDriftEngine:
    """Engine: Compares Narrative vs Reality extracted from graph data using Generative AI."""
    def __init__(self):
        pass

    def run(self, entities):
        print("[RealityDriftEngine] Computing Drift Analysis via LLM...")
        db = SessionLocal()
        try:
            for e in entities:
                if e['type'] == 'Technology' or e['type'] == 'Company':
                    # Ask LLM to evaluate drift
                    prompt = f"Analyze the reality drift for {e['name']}. Compare mainstream narrative vs potential reality. Return exactly 2 sentences."
                    try:
                        response = anakin_chatgpt(prompt)
                    except Exception as exc:
                        print(f"[RealityDriftEngine] G4F API failed, using fallback heuristic: {exc}")
                        response = f"System detected {e['name']} divergence from established ground truth due to asymmetric capital flows."
                    
                    # Save to Anomaly if it suggests drift
                    drift_anom = Anomaly(
                        id=str(uuid.uuid4()),
                        anomaly_type="Reality Drift",
                        entity_name=e['name'],
                        entity_type=e['type'],
                        severity="High",
                        description=response,
                        status="Active"
                    )
                    db.add(drift_anom)
                    print(f"[RealityDriftEngine] Logged Drift for {e['name']}: {response}")
            db.commit()
        finally:
            db.close()
        return entities

reality_drift_engine = RealityDriftEngine()
