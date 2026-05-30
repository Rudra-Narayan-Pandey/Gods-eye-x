# Holocron - Agent Orchestration Architecture

import asyncio

# Phase 1
from backend.holocron.agents.discovery_agent import discovery_agent
from backend.holocron.agents.extraction_agent import extraction_agent
from backend.holocron.agents.verification_agent import verification_agent
from backend.holocron.agents.knowledge_graph_agent import knowledge_graph_agent
from backend.holocron.agents.vector_memory_agent import vector_memory_agent
from backend.wire.ingestion import wire_engine

# Phase 2
from backend.holocron.engines.intelligence_engine import intelligence_engine
from backend.holocron.engines.opportunity_engine import opportunity_engine
from backend.holocron.engines.risk_engine import risk_engine
from backend.holocron.engines.reality_drift_engine import reality_drift_engine
from backend.holocron.engines.explainability_engine import explainability_engine

# Phase 3
from backend.holocron.domains.domain_engines import domain_engines

# Phase 4
from backend.holocron.delivery.report_agent import report_agent

class HolocronOrchestrator:
    def __init__(self):
        pass

    def run_pipeline(self):
        print("\n=======================================================")
        print("HOLOCRON: INITIATING GLOBAL INTELLIGENCE DAG")
        print("=======================================================\n")
        
        # --- PHASE 1: Ingestion & Extraction ---
        raw_signals = discovery_agent.run()
        extracted_entities = extraction_agent.run(raw_signals)
        verified_entities = verification_agent.run(extracted_entities)
        
        # --- PHASE 2: Graph & Memory Persistance ---
        knowledge_graph_agent.run(verified_entities)
        vector_memory_agent.run(verified_entities)
        
        # --- PHASE 3: Intelligence Engines ---
        intelligence_engine.run(verified_entities)
        opportunities = opportunity_engine.run(verified_entities)
        risks = risk_engine.run(verified_entities)
        
        reality_drift_engine.run(verified_entities)
        explainability_engine.run(opportunities, risks)
        
        # --- PHASE 4: Domain Rankings ---
        domain_engines.run(verified_entities)
        
        # --- PHASE 5: Delivery & Reporting ---
        final_report = report_agent.run(opportunities, risks)
        
        print("\n=======================================================")
        print("HOLOCRON: PIPELINE EXECUTION COMPLETE.")
        print("=======================================================\n")
        
        return final_report

    def run_dynamic_pipeline(self, query: str):
        print("\n=======================================================")
        print(f"HOLOCRON: INITIATING RAPID DYNAMIC DAG FOR '{query}'")
        print("=======================================================\n")

        # 1. Dynamic Ingestion
        raw_signals = wire_engine.fetch_dynamic_query(query)
        if not raw_signals:
            return []
            
        # 2. Discovery & Filtering
        cleaned_signals = discovery_agent.run(raw_signals)
        
        # 3. Entity Extraction via LLM
        extracted_entities = extraction_agent.run(cleaned_signals)
        
        # 4. Verification & Consensus via LLM
        verified_entities = verification_agent.run(extracted_entities)
        
        # 5. Graph Persistence
        knowledge_graph_agent.run(verified_entities)
        
        print("\n=======================================================")
        print("HOLOCRON: RAPID DYNAMIC PIPELINE COMPLETE.")
        print("=======================================================\n")
        return verified_entities

holocron_engine = HolocronOrchestrator()
