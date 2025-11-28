$ErrorActionPreference = "Stop"

Write-Host "Preparando entorno para el Generador Automático de Documentación..."

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Join-Path $root ".."
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"
$dockerPath = Join-Path $projectRoot "docker"

Set-Location $backendPath
Write-Host "Instalando dependencias Backend..."
npm install

Set-Location $frontendPath
Write-Host "Instalando dependencias Frontend..."
npm install

Set-Location $dockerPath
Write-Host "Para arrancar con Docker ejecute: docker compose up --build"

Write-Host "Para modo local:"
Write-Host "  1) Terminal 1 -> cd $backendPath; npm start"
Write-Host "  2) Terminal 2 -> cd $frontendPath; npm run dev -- --host --port 8978"

Write-Host "Listo. Revise las variables VITE_API_URL/PORT si cambia puertos."
