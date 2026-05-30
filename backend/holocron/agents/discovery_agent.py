from backend.wire.ingestion import wire_engine
from backend.database import SessionLocal
from backend.models import Signal
import datetime
import uuid

class SignalDiscoveryAgent:
    """Agent 1: Collects real-time information from Anakin Wire."""
    def __init__(self):
        pass

    def run(self, raw_signals=None):
        print("[SignalDiscoveryAgent] Collecting real-time signals from Anakin Wire...")
        if raw_signals is None:
            raw_signals = wire_engine.run_full_ingestion()
        
        # Simulating deduplication, clustering, and spam filtering
        cleaned_signals = []
        seen = set()
        for signal in raw_signals:
            key = signal.get("title") or signal.get("ticker")
            if key not in seen:
                seen.add(key)
                signal_id = str(uuid.uuid4())
                signal['signal_id'] = signal_id
                signal['trust_score'] = 0.88 # Simulated high-authority source
                cleaned_signals.append(signal)
                
        # Persist signals to historical database
        db = SessionLocal()
        try:
            for s in cleaned_signals:
                existing = db.query(Signal).filter(Signal.title == s.get('title')).first()
                if not existing:
                    new_sig = Signal(
                        id=s['signal_id'],
                        type=s.get('type', 'news'),
                        source=s.get('source', 'wire'),
                        title=s.get('title', s.get('ticker')),
                        content=s.get('content', ''),
                        url=s.get('url', ''),
                        trust_score=s['trust_score'],
                        raw_data=s
                    )
                    db.add(new_sig)
            db.commit()
            print(f"[SignalDiscoveryAgent] Persisted {len(cleaned_signals)} historical signals to DB.")
        except Exception as e:
            print(f"[SignalDiscoveryAgent] DB Error: {e}")
            db.rollback()
        finally:
            db.close()
                
        print(f"[SignalDiscoveryAgent] Filtered {len(raw_signals)} raw signals down to {len(cleaned_signals)} high-quality signals.")
        return cleaned_signals

discovery_agent = SignalDiscoveryAgent()
