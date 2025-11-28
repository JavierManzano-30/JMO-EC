# Generador Automático de Documentación para Proyectos Java

Sprint 6 - Entorno Cliente. Prototipo completo con backend en Node.js, frontend en React + TailwindCSS, Docker y script de setup en PowerShell.

## Estructura
- `backend/`: API con Express (`/api/analyze`, `/api/history`, `/api/docs/:id`), analizadores en `analyzers/`, generación PlantUML en `generators/`, integración IA y PDF en `services/`, historial persistente en `storage/`.
- `frontend/`: React + Tailwind (puerto 8978). Componentes para selección/carga, estado, resultados y historial.
- `docker/`: `docker-compose.yml`, `backend.Dockerfile`, `frontend.Dockerfile`.
- `scripts/Setup.ps1`: instala dependencias y muestra comandos de arranque.

## Backend rápido
```bash
cd backend
npm install
npm start
```
Endpoints principales:
- `POST /api/analyze` (multipart: `project` archivo zip/java y/o `projectPath` carpeta)
- `GET /api/history`
- `GET /api/docs/:id?format=md|pdf`

## Frontend rápido
```bash
cd frontend
npm install
npm run dev -- --host --port 8978
```
Configura `VITE_API_URL` si el backend usa otro host/puerto.

## Docker
```bash
cd docker
docker compose up --build
```
Incluye PlantUML, Graphviz y Pandoc en la imagen de backend.

## Notas
- El analizador soporta carpetas, `.java` sueltos o `.zip` (se descomprime en `uploads/unzipped`).
- El PDF generado es un placeholder; cambie `services/pdfService.js` para usar Pandoc real si está disponible.
