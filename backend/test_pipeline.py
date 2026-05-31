import sys
from backend.holocron.ultimate_pipeline import UltimatePipelineEngine

try:
    dyn_engine = UltimatePipelineEngine()
    print("Engine instantiated.")
    pipeline_results = dyn_engine.run_full_pipeline("america", [])
    print("Pipeline ran successfully.")
except Exception as e:
    import traceback
    print("Error during pipeline execution:")
    traceback.print_exc()
