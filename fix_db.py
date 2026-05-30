import sys
import os
sys.path.append(os.getcwd())
from sqlalchemy import text
from backend.database import engine

with engine.connect() as conn:
    try:
        conn.execute(text('ALTER TABLE opportunities ADD COLUMN evidence_refs JSON DEFAULT \'[]\''))
        conn.commit()
        print("Column added successfully!")
    except Exception as e:
        print(e)
