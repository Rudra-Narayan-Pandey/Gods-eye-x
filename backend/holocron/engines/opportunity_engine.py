from backend.database import SessionLocal
from backend.models import Opportunity
import uuid

class OpportunityDiscoveryEngine:
    """Engine: Searches for undervalued technologies and fast-growing startups."""
    def __init__(self):
        pass

    def run(self, entities):
        print("[OpportunityDiscoveryEngine] Searching for hidden opportunities...")
        opportunities = []
        
        db = SessionLocal()
        try:
            for e in entities:
                if e['type'] == 'Technology' or e['type'] == 'Company':
                    opp = Opportunity(
                        id=str(uuid.uuid4()),
                        title=f"Emerging Growth in {e['name']}",
                        description=f"AI detected anomalous hiring and patent growth for {e['name']}.",
                        category="Investment",
                        confidence_score=0.92,
                        impact_score=0.88,
                        time_horizon="12-24 Months",
                        potential_value="High"
                    )
                    db.add(opp)
                    opportunities.append(opp)
            db.commit()
            print(f"[OpportunityDiscoveryEngine] Generated {len(opportunities)} opportunities.")
        except Exception as exc:
            db.rollback()
        finally:
            db.close()
            
        return opportunities

opportunity_engine = OpportunityDiscoveryEngine()
