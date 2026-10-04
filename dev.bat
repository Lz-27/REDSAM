@echo off
echo =======================================================
echo     Iniciando Entorno de Desarrollo REDSAM
echo =======================================================
echo.

echo [1/2] Iniciando Backend (FastAPI en puerto 8000)...
start "REDSAM - Backend" cmd /k "cd backend && call venv\Scripts\activate && python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Iniciando Frontend (Vite en puerto 5173)...
start "REDSAM - Frontend" cmd /k "cd redsam_oc && pnpm run dev"

echo.
echo =======================================================
echo ¡Servidores iniciados en ventanas separadas!
echo Backend: http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo =======================================================
echo.
pause
