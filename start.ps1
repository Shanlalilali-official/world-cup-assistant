# 2026 World Cup Assistant — One-click Launcher (PowerShell)
$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "⚽ 2026 世界杯观赛助手 | World Cup Assistant"

Set-Location $PSScriptRoot

Write-Host ""
Write-Host " ╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host " ║        ⚽ 2026 世界杯观赛助手 ⚽              ║" -ForegroundColor Cyan
Write-Host " ║     World Cup Assistant Launcher             ║" -ForegroundColor Cyan
Write-Host " ╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
$nodeVersion = (Get-Command node -ErrorAction SilentlyContinue)
if (-not $nodeVersion) {
    Write-Host "[ERROR] Node.js not found! Install from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies if needed
Write-Host "[1/4] Checking dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "[*] Installing root dependencies..." -ForegroundColor Gray
    npm install
}

if (-not (Test-Path "server\node_modules")) {
    Write-Host "[*] Installing server dependencies..." -ForegroundColor Gray
    Push-Location server
    npm install
    Pop-Location
}

if (-not (Test-Path "client\node_modules")) {
    Write-Host "[*] Installing client dependencies..." -ForegroundColor Gray
    Push-Location client
    npm install
    Pop-Location
}

Write-Host "[2/4] Dependencies OK" -ForegroundColor Green
Write-Host "[3/4] Starting servers..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   Backend  → http://localhost:3001" -ForegroundColor Blue
Write-Host "   Frontend → http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "   Press Ctrl+C to stop all servers." -ForegroundColor Gray
Write-Host " ═══════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""

# Launch both servers
npm run dev
