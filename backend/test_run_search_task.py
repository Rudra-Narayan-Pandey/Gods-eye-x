import asyncio
import os
import sys

def mock_run_search_task(q: str):
    print(f"Starting test for: {q}")
    os.environ["DATABASE_URL"] = "sqlite:///./dev.db"  # Force sqlite
    from backend.main import run_search_task, SEARCH_TASKS
    task_id = "test-task"
    SEARCH_TASKS[task_id] = {"status": "processing"}
    
    print("Executing run_search_task...")
    try:
        run_search_task(task_id, q)
    except Exception as e:
        print(f"Caught expected/unexpected error: {e}")
    print("Finished.")
    print("Task Status:", SEARCH_TASKS[task_id]["status"])
    if SEARCH_TASKS[task_id]["status"] == "error":
        print("Error message:", SEARCH_TASKS[task_id].get("message"))

if __name__ == "__main__":
    import sys
    q = sys.argv[1] if len(sys.argv) > 1 else "APPLE"
    mock_run_search_task(q)
