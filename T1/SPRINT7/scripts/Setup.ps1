param(
  [ValidateSet("docker", "local")]
  [string]$Mode = "docker"
)

$ErrorActionPreference = "Stop"

Write-Host "Preparando entorno para el Generador Automatico de Documentacion..."

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

if ($Mode -eq "docker") {
  if (Get-Command docker -ErrorAction SilentlyContinue) {
    Set-Location $dockerPath
    Write-Host "Arrancando Docker Compose..."
    docker compose up --build -d
    Write-Host "Servicios Docker levantados."
    Write-Host "Frontend: http://localhost:8978"
    Write-Host "Backend:  http://localhost:3001"
  } else {
    Write-Host "Docker no esta disponible. Ejecuta con -Mode local o instala Docker."
  }
} else {
  Write-Host "Modo local listo."
  Write-Host "  1) Terminal 1 -> cd $backendPath; npm start"
  Write-Host "  2) Terminal 2 -> cd $frontendPath; npm run dev -- --host --port 8978"
  Write-Host "Configura VITE_API_URL si cambias el puerto del backend."
}
