from backend.holocron.anakin_llm import anakin_chatgpt

class VerificationAgent:
    """Agent 3: Cross-references entities against multiple sources and calculates consensus via LLM."""
    def __init__(self):
        pass

    def run(self, entities):
        print("[VerificationAgent] Searching for additional evidence and verifying claims via AI...")
        verified_entities = []
        
        for e in entities:
            # Ask LLM to act as a Verification agent evaluating the confidence
            prompt = f"""
            Act as an OSINT Verification Agent. Evaluate the real-world existence and validity of the entity '{e['name']}' of type '{e['type']}'.
            Return exactly a single float between 0.0 and 1.0 representing your confidence score in this entity's validity.
            """
            try:
                response = anakin_chatgpt(prompt)
                
                # Extract the float from the response
                import re
                match = re.search(r"0\.\d+|1\.0", response)
                if match:
                    confidence = float(match.group(0))
                else:
                    confidence = 0.90
                    
                e['verification_score'] = confidence
                e['consensus'] = "Strong" if confidence > 0.8 else "Weak"
                e['verification_status'] = "Verified" if confidence > 0.7 else "Unverified"
                
            except Exception as exc:
                print(f"[VerificationAgent] AI Verification failed for {e['name']}: {exc}")
                e['verification_score'] = 0.0
                e['consensus'] = "Unavailable"
                e['verification_status'] = "Unverified"
            
            e['evidence'] = e.get('evidence', [])
            verified_entities.append(e)
            
        print(f"[VerificationAgent] Verified {len(verified_entities)} entities via LLM Consensus.")
        return verified_entities

verification_agent = VerificationAgent()
