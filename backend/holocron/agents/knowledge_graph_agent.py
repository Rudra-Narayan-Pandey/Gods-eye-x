from backend.database import SessionLocal, get_neo4j
from backend.models import Entity, Edge
import uuid

class KnowledgeGraphAgent:
    """Agent 4: Writes Nodes and Relationships into Neo4j and Postgres."""
    def __init__(self):
        pass

    def run(self, entities):
        print("[KnowledgeGraphAgent] Updating Neo4j Knowledge Graph and PostgreSQL...")
        
        # 1. PostgreSQL DB updating is now strictly handled by the realtime /search pipeline.
        # Background loops are explicitly blocked from injecting garbage entities.
            
        # 2. Update Neo4j Graph
        try:
            session = get_neo4j()
            for e in entities:
                # Merge Node
                session.run(
                    "MERGE (n:Entity {name: $name}) SET n.type = $type, n.momentum = $momentum",
                    name=e['name'], type=e['type'], momentum=e.get('confidence', 0.85)
                )
            print(f"[KnowledgeGraphAgent] Successfully persisted {len(entities)} entities to Graph.")
        except Exception as e:
            print(f"Neo4j Error: {e}")

knowledge_graph_agent = KnowledgeGraphAgent()
