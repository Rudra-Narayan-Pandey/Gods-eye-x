import sys
import uuid
import traceback

def mock_run_search_task():
    try:
        from backend.main import run_search_task, SEARCH_TASKS
        task_id = "test_id_123"
        SEARCH_TASKS[task_id] = {"status": "processing"}
        
        run_search_task(task_id, "america")
        
        print(f"Task Status: {SEARCH_TASKS[task_id]['status']}")
        if SEARCH_TASKS[task_id]['status'] == "error":
            print(f"Error Message: {SEARCH_TASKS[task_id]['message']}")
    except Exception as e:
        print("Fatal error calling task:")
        traceback.print_exc()

if __name__ == "__main__":
    mock_run_search_task()
