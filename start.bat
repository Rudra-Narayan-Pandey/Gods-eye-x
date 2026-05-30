@echo off
echo Starting GOD'S EYE X - Full Stack...

:: Start Backend in a new window
echo Starting FastAPI Backend (Port 8000)...
start "God's Eye X - Backend" cmd /c ".\venv\Scripts\activate && uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"

:: Start Frontend in a new window
echo Starting Vite Frontend (Port 3000)...
start "God's Eye X - Frontend" cmd /c "npm run dev"

echo.
echo =======================================================
echo Both servers are starting in separate windows.
echo Frontend will be available at: http://localhost:3000
echo Backend API Docs available at: http://localhost:8000/docs
echo =======================================================
pause
