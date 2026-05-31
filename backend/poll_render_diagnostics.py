import time
import requests

def main():
    print("Waiting for Render deployment to finish...")
    while True:
        try:
            res = requests.get("https://gods-eye-x.onrender.com/api/diagnostics/tasks", timeout=5)
            if res.status_code == 200:
                print("Endpoint is alive! Triggering search...")
                break
        except:
            pass
        time.sleep(10)
        
    # Trigger the search task
    search_res = requests.get("https://gods-eye-x.onrender.com/api/search?q=america")
    task_id = search_res.json().get("task_id")
    print(f"Triggered task: {task_id}")
    
    print("Waiting 5 seconds for the task to crash...")
    time.sleep(5)
    
    # Dump the tasks to see the traceback
    diag_res = requests.get("https://gods-eye-x.onrender.com/api/diagnostics/tasks")
    tasks = diag_res.json()
    
    if task_id in tasks:
        task = tasks[task_id]
        print(f"Task Status: {task.get('status')}")
        if task.get("status") == "error":
            print(f"TRACEBACK:\n{task.get('message')}")
        else:
            print(f"Task didn't error. Data: {task}")
    else:
        print("Task ID not found in SEARCH_TASKS!")

if __name__ == "__main__":
    main()
