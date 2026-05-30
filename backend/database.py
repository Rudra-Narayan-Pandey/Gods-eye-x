import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from neo4j import GraphDatabase
from qdrant_client import QdrantClient
import redis

# 1. PostgreSQL (Relational Data)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:password123@127.0.0.1:5433/gods_eye")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 2. Neo4j (Knowledge Graph)
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://127.0.0.1:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password123")
neo4j_driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def get_neo4j():
    return neo4j_driver.session()

# 3. Qdrant (Vector DB)
QDRANT_URL = os.getenv("QDRANT_URL", "http://127.0.0.1:6333")
qdrant_client = QdrantClient(url=QDRANT_URL)

# 4. Redis (Cache & PubSub)
REDIS_URL = os.getenv("REDIS_URL", "redis://127.0.0.1:6379")
redis_client = redis.Redis.from_url(REDIS_URL)

print("God's Eye X: Databases initialized.")
