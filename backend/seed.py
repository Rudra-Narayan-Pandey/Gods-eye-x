import json
import uuid
from datetime import datetime
from backend.database import SessionLocal, engine
from backend import models

# Recreate all tables
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    try:
        with open('backend/data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        print("Seeding Companies...")
        for c in data.get('companies', []):
            db.add(models.Entity(
                id=c['id'],
                type='company',
                name=c['name'],
                logo=c.get('logo'),
                logo_color=c.get('logoColor'),
                description=c.get('description'),
                momentum=c.get('momentum', 0.5),
                tags=c.get('tags', []),
                trend_data=c.get('trendData', []),
                properties={k:v for k,v in c.items() if k not in ['id','name','logo','logoColor','description','momentum','tags','trendData']}
            ))

        print("Seeding Startups...")
        for s in data.get('startups', []):
            db.add(models.Entity(
                id=s['id'],
                type='startup',
                name=s['name'],
                logo=s.get('logo'),
                logo_color=s.get('logoColor'),
                description=s.get('description'),
                momentum=s.get('momentum', 0.5),
                tags=s.get('tags', []),
                trend_data=s.get('trendData', []),
                properties={k:v for k,v in s.items() if k not in ['id','name','logo','logoColor','description','momentum','tags','trendData']}
            ))

        print("Seeding Technologies...")
        for t in data.get('technologies', []):
            db.add(models.Entity(
                id=t['id'],
                type='technology',
                name=t['name'],
                logo=t.get('icon'),
                logo_color=None,
                description=t.get('description'),
                momentum=t.get('maturityScore', 0.5), # mapping maturity to momentum loosely
                tags=t.get('useCases', []),
                trend_data=t.get('trendData', []),
                properties={k:v for k,v in t.items() if k not in ['id','name','icon','description','useCases','trendData']}
            ))

        print("Seeding Anomalies...")
        for a in data.get('anomalies', []):
            db.add(models.Anomaly(
                id=a['id'],
                anomaly_type=a.get('anomalyType'),
                entity_name=a.get('entityName'),
                entity_type=a.get('entityType'),
                metric_name=a.get('metricName'),
                actual_value=a.get('actualValue', 0),
                expected_value=a.get('expectedValue', 0),
                deviation_percentage=a.get('deviationPercentage', 0),
                severity=a.get('severity'),
                description=a.get('description'),
                detected_at=datetime.fromisoformat(a.get('detectedAt').replace('Z','')) if a.get('detectedAt') else datetime.utcnow(),
                status=a.get('status')
            ))

        print("Seeding Opportunities...")
        for o in data.get('opportunities', []):
            db.add(models.Opportunity(
                id=o['id'],
                title=o.get('title'),
                description=o.get('description'),
                category=o.get('category'),
                confidence_score=o.get('confidenceScore', 0),
                impact_score=o.get('impactScore', 0),
                time_horizon=o.get('timeHorizon'),
                potential_value=o.get('potentialValue'),
                properties={'evidence': o.get('evidence', []), 'relatedEntities': o.get('relatedEntities', [])}
            ))

        print("Seeding Evidence...")
        for e in data.get('evidence', []):
            db.add(models.Evidence(
                id=e['id'],
                source=e.get('source'),
                title=e.get('title'),
                snippet=e.get('snippet'),
                url=e.get('url'),
                trust_score=e.get('trustScore', 0),
                category=e.get('category')
            ))
            
        print("Seeding Trends...")
        for t in data.get('trends', []):
            db.add(models.Trend(
                id=t['id'],
                name=t.get('name'),
                direction=t.get('direction'),
                velocity=t.get('velocity'),
                period=t.get('period'),
                description=t.get('description'),
                category=t.get('category'),
                trend_data=t.get('trendData', []),
                properties={'relatedEntities': t.get('relatedEntities', []), 'signals': t.get('signals', [])}
            ))
            
        print("Seeding Edges...")
        # Note: we are only seeding graph edges for nodes that actually exist in our entities table,
        # but the frontend graph logic has graphNodes that include countries and events not listed above.
        # Let's dynamically add any missing nodes from graphNodes.
        existing_entity_ids = {e.id for e in db.query(models.Entity).all()}
        
        for gn in data.get('graphNodes', []):
            if gn['id'] not in existing_entity_ids:
                db.add(models.Entity(
                    id=gn['id'],
                    type=gn.get('type', 'event'),
                    name=gn.get('name', gn['id']),
                    description=gn.get('properties', {}).get('description', ''),
                    momentum=0.5,
                    properties=gn.get('properties', {})
                ))
                existing_entity_ids.add(gn['id'])

        for e in data.get('graphEdges', []):
            # some edges might be objects {id}, we extract string id
            s_id = e['source']['id'] if isinstance(e['source'], dict) else e['source']
            t_id = e['target']['id'] if isinstance(e['target'], dict) else e['target']
            
            db.add(models.Edge(
                source_id=s_id,
                target_id=t_id,
                type=e.get('type', 'RELATES_TO'),
                weight=e.get('weight', 1)
            ))
            
        db.commit()
        print("Successfully seeded all data!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding DB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
