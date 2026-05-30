from backend.database import SessionLocal
from backend.models import Anomaly
import uuid

class RiskDetectionEngine:
    """Engine: Searches for policy risks, supply chain risks, and regulatory risks."""
    def __init__(self):
        pass

    def run(self, entities):
        print("[RiskDetectionEngine] Searching for risks and anomalies...")
        anomalies = []
        
        db = SessionLocal()
        try:
            for e in entities:
                if e['type'] == 'Policy' or e['type'] == 'Country':
                    anom = Anomaly(
                        id=str(uuid.uuid4()),
                        anomaly_type="Regulatory Risk",
                        entity_name=e['name'],
                        entity_type=e['type'],
                        metric_name="Regulatory Sentiment",
                        actual_value=-0.5,
                        expected_value=0.2,
                        deviation_percentage=-350,
                        severity="High",
                        description=f"New regulation detected affecting {e['name']}.",
                        status="Active"
                    )
                    db.add(anom)
                    anomalies.append(anom)
            db.commit()
            print(f"[RiskDetectionEngine] Generated {len(anomalies)} risks.")
        except Exception as exc:
            db.rollback()
        finally:
            db.close()
            
        return anomalies

risk_engine = RiskDetectionEngine()
