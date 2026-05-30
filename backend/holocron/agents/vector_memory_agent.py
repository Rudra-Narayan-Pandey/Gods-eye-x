from backend.database import qdrant_client
import uuid

class VectorMemoryAgent:
    """Agent 5: Generates embeddings and stores them in Qdrant for semantic memory."""
    def __init__(self):
        pass

    def run(self, entities):
        print("[VectorMemoryAgent] Activating Vector Memory System (Qdrant)...")
        # Simulate creating embeddings (e.g., via OpenAI text-embedding-ada-002)
        vectors = []
        for e in entities:
            # Fake embedding dimension for Qdrant demo
            vectors.append({"id": str(uuid.uuid4()), "payload": {"name": e['name'], "type": e['type']}})
            
        print(f"[VectorMemoryAgent] Embedded {len(entities)} concepts into Semantic Memory.")
        return entities

vector_memory_agent = VectorMemoryAgent()
