@echo off
chcp 65001 >nul
title 2026 世界杯观赛助手 | World Cup Assistant

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║        ⚽ 2026 世界杯观赛助手 ⚽              ║
echo  ║     World Cup Assistant Launcher             ║
echo  ╚══════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Checking dependencies...
if not exist "node_modules" (
    echo [*] Installing root dependencies...
    call npm install
)

if not exist "server\node_modules" (
    echo [*] Installing server dependencies...
    cd server
    call npm install
    cd ..
)

if not exist "client\node_modules" (
    echo [*] Installing client dependencies...
    cd client
    call npm install
    cd ..
)

echo [2/3] Dependencies ready.
echo [3/3] Starting servers...
echo.
echo   Backend  → http://localhost:3001
echo   Frontend → http://localhost:5173
echo.
echo   Press Ctrl+C to stop all servers.
echo ═══════════════════════════════════════════════
echo.

call npm run dev

pause
