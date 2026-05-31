import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from neo4j import GraphDatabase
from qdrant_client import QdrantClient
import redis

# 1. PostgreSQL (Relational Data)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:password123@127.0.0.1:5433/gods_eye")

# Try to connect to the configured relational DB, but fall back to a lightweight SQLite
# database when the target DB server is not available (useful for local development).
try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    # Verify we can obtain a connection; if this fails, fall back to SQLite
    try:
        conn = engine.connect()
        conn.close()
    except Exception as conn_err:
        raise conn_err

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()

    def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
except Exception as e:
    # Fallback to SQLite file-based DB
    fallback_url = "sqlite:///./dev.db"
    print(f"Database connection failed ({e}). Falling back to {fallback_url} for local development.")
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False})
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
try:
    neo4j_driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    def get_neo4j():
        return neo4j_driver.session()
except Exception as e:
    print(f"Warning: Could not initialize Neo4j driver ({e}). Neo4j features will be disabled.")
    neo4j_driver = None
    def get_neo4j():
        return None

# 3. Qdrant (Vector DB)
QDRANT_URL = os.getenv("QDRANT_URL", "http://127.0.0.1:6333")
try:
    qdrant_client = QdrantClient(url=QDRANT_URL)
except Exception as e:
    print(f"Warning: Could not initialize Qdrant client ({e}). Vector DB features will be disabled.")
    qdrant_client = None

# 4. Redis (Cache & PubSub)
REDIS_URL = os.getenv("REDIS_URL", "redis://127.0.0.1:6379")
try:
    redis_client = redis.Redis.from_url(REDIS_URL)
except Exception as e:
    print(f"Warning: Could not initialize Redis client ({e}). Caching features will be disabled.")
    redis_client = None

print("God's Eye X: Databases initialized.")
