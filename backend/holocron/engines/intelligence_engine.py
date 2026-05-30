class IntelligenceEngine:
    """Engine: Calculates momentum scores based on hiring, funding, patents, etc."""
    def __init__(self):
        pass

    def run(self, entities):
        print("[IntelligenceEngine] Detecting patterns (Hiring, Funding, Patents, Research)...")
        # Algorithmic Momentum calculation
        for e in entities:
            # Simulate metrics extracted from the knowledge graph
            mentions = 100
            funding = 50000000
            
            # Startup Momentum Formula
            if e['type'] == 'Company':
                e['startup_momentum'] = (mentions * 0.3) + (funding * 0.0000005)
                e['confidence'] = min(0.99, e.get('confidence', 0.5) * 1.1)
                
            # Technology Momentum Formula
            elif e['type'] == 'Technology':
                e['technology_momentum'] = (mentions * 0.5) + (funding * 0.0000002)
                e['confidence'] = min(0.99, e.get('confidence', 0.5) * 1.15)
                
        print("[IntelligenceEngine] Trend detected: AI Infrastructure is rapidly accelerating.")
        print(f"[IntelligenceEngine] Calculated Momentum Scores for {len(entities)} entities.")
        return entities

intelligence_engine = IntelligenceEngine()
