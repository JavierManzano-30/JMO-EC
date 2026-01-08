# Generador Automatico de Documentacion para Proyectos Java

Sprint 7 - Implementacion completa con backend en Node.js, frontend en React + TailwindCSS, Docker y script de setup en PowerShell.

## Estructura
- `backend/`: API con Express (`/api/analyze`, `/api/history`, `/api/docs/:id`), analizadores en `analyzers/`, PlantUML en `generators/`, IA y PDF en `services/`, historial en `storage/`.
- `frontend/`: React + Tailwind (puerto 8978). Vista de resultados con render de Markdown, descarga de PDF/MD e historial.
- `docker/`: `docker-compose.yml`, `backend.Dockerfile`, `frontend.Dockerfile`.
- `scripts/Setup.ps1`: instala dependencias y levanta el entorno (docker o local).

## Backend rapido
```bash
cd backend
npm install
npm start
```
Endpoints principales:
- `POST /api/analyze` (multipart: `project` archivo zip/java y/o `projectPath` carpeta)
- `GET /api/history`
- `GET /api/docs/:id?format=md|pdf`

## Frontend rapido
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
La imagen de backend instala PlantUML, Graphviz y Pandoc.

## Como probar en Docker (paso a paso)
1. Abre LMStudio y deja el servidor activo en `http://127.0.0.1:1234`.
2. En `SPRINT7/docker`, levanta los servicios:
   ```bash
   docker compose up --build -d
   ```
3. Abre `http://localhost:8978`.
4. Sube un `.java` o `.zip` con codigo Java y pulsa "Generar documentacion".
5. Verifica:
   - Markdown renderizado en la vista de resultados.
   - Descargas de Markdown/PDF.
   - Historial actualizado.

## Setup.ps1
```powershell
.\scripts\Setup.ps1
.\scripts\Setup.ps1 -Mode local
```

## Notas
- El analizador soporta carpetas, `.java` sueltos o `.zip` (se descomprime en `uploads/unzipped`).
- La conversion a PDF usa Pandoc si esta disponible; si no, genera un placeholder para validar el flujo.
- Para IA local, define `AI_URL` (endpoint estilo OpenAI) y opcionalmente `AI_MODEL`. El backend carga `.env` automaticamente.
- Los resultados se copian a `SPRINT7/descargas/markdown` y `SPRINT7/descargas/pdf` con el ID de ejecucion.
- El UML se genera en `.puml` y tambien se exporta a PNG para descargar desde el frontend.
- El diagrama UML incluye relaciones basicas (herencia, interfaces, asociaciones y dependencias) cuando se detectan en el codigo Java.

## Mejoras implementadas
- Estadisticas adicionales del analisis (total de metodos) en el resumen.
- Recomendaciones generadas por IA cuando `AI_URL` esta configurado.
- Descarga directa de Markdown/PDF desde la vista de resultados.
