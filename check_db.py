import sys
import os
sys.path.append(os.getcwd())
from sqlalchemy import text
from backend.database import engine

with engine.connect() as conn:
    try:
        res = conn.execute(text("SELECT id, name FROM entities WHERE name ILIKE '%trump%'"))
        print("Results for trump:", res.fetchall())
    except Exception as e:
        print(e)
