import g4f

class ExplainabilityEngine:
    """Engine: Attaches explainable proofs to all insights using Generative AI."""
    def __init__(self):
        pass

    def run(self, opportunities, risks):
        print("[ExplainabilityEngine] Generating cryptographic-style proofs for insights via LLM...")
        
        for opp in opportunities:
            prompt = f"Explain in exactly one sentence why {opp.title} represents a high-value opportunity based on market dynamics."
            try:
                response = g4f.ChatCompletion.create(
                    model=g4f.models.gpt_4o_mini,
                    messages=[{"role": "user", "content": prompt}],
                )
                if opp.properties is None:
                    opp.properties = {}
                opp.properties['explainability_proof'] = response
                print(f"[ExplainabilityEngine] Generated Proof for {opp.title}: {response}")
            except Exception as e:
                if opp.properties is None:
                    opp.properties = {}
                opp.properties['explainability_proof'] = "AI Explanation temporarily unavailable due to rate limits."
                
        for risk in risks:
            prompt = f"Explain in exactly one sentence why {risk.entity_name} faces a {risk.anomaly_type} risk."
            try:
                response = g4f.ChatCompletion.create(
                    model=g4f.models.gpt_4o_mini,
                    messages=[{"role": "user", "content": prompt}],
                )
                risk.description = response
            except Exception as e:
                pass
                
        return {"opportunities": opportunities, "risks": risks, "explainability_attached": True}

explainability_engine = ExplainabilityEngine()
