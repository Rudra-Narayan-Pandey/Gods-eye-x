@echo off
echo Starting GOD'S EYE X - MASTER BUILD...

:: Check Docker Compose
echo Verifying Database Infrastructure...
docker-compose up -d

:: Start Backend in a new window
echo Starting Holocron FastAPI Backend (Port 8000)...
start "God's Eye X - Holocron API" cmd /c ".\venv\Scripts\activate && uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"

:: Start Frontend in a new window
echo Starting Next.js Frontend (Port 3000)...
start "God's Eye X - Next.js UI" cmd /c "cd frontend && npm run dev"

echo.
echo =======================================================
echo All services are initiating! 
echo Opening your browser now...
echo =======================================================

:: Wait 3 seconds to let servers start
timeout /t 3 /nobreak > NUL

:: Open browser automatically
start http://localhost:3000
start http://localhost:8000/docs
start http://localhost:7474

pause
