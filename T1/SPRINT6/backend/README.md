
# Backend — Generador Automático de Documentación para Proyectos Java

Este directorio contiene el diseño técnico previsto del **backend** del sistema de generación automática de documentación para proyectos Java, correspondiente al Sprint 6 del módulo de Entorno Cliente.

> 📌 Importante: En este sprint **no se implementa código**, solo se documenta la arquitectura y el funcionamiento previsto.

---

## 1. Objetivo del Backend

El backend será el encargado de coordinar todo el proceso de generación de documentación:

- Recibir el proyecto Java comprimido (`.zip`).
- Analizar los archivos `.java` para extraer:
  - paquetes,
  - clases,
  - métodos.
- Generar diagramas UML mediante PlantUML.
- Crear documentación técnica en formato Markdown.
- Enviar descripciones parciales a la IA local (LMStudio) para enriquecerlas.
- Generar un archivo PDF final a partir del Markdown.
- Registrar cada ejecución en un historial consultable desde el frontend.
- Exponer todos estos procesos mediante una API REST.

---

## 2. Endpoints previstos

### ### POST `/api/analyze`
**Función:**  
Procesar un proyecto Java completo y generar toda la documentación.

**Flujo resumido:**
1. Recibir ZIP del proyecto.
2. Descomprimirlo.
3. Analizar clases, paquetes y métodos.
4. Generar diagrama UML (.puml).
5. Crear Markdown base.
6. Enviar resumen a la IA local.
7. Insertar texto enriquecido en el Markdown.
8. Convertir Markdown a PDF.
9. Guardar todo en el historial.
10. Devolver:
   - ID de ejecución,
   - estadísticas básicas,
   - rutas de descarga.

---

### GET `/api/history`
**Función:**  
Devolver la lista de ejecuciones previas.

Cada entrada del historial incluye:

- `id`
- nombre del proyecto
- fecha
- estado
- estadísticas (paquetes, clases, métodos, etc.)
- rutas de los archivos generados

---

### GET `/api/docs/:id?format=pdf|md`
**Función:**  
Permitir descargar el archivo PDF o Markdown generado en una ejecución concreta.

---

## 3. Estructura prevista del Backend

```text
backend/
  src/
    index.js                # Punto de entrada de la API
    routes/
      analyze.routes.js
      history.routes.js
      docs.routes.js
    controllers/
      analyze.controller.js
      history.controller.js
      docs.controller.js
    analyzers/
      javaAnalyzer.js       # Analiza los .java
    generators/
      plantumlGenerator.js  # Genera .puml
      markdownGenerator.js  # Genera .md
      pdfGenerator.js       # Convierte .md a .pdf
    services/
      aiService.js          # Conexión con IA local (LMStudio)
      historyService.js     # Guarda historial
      storageService.js     # Manejo de archivos y rutas
    config/
      config.js
  package.json
  Dockerfile
````

Esta estructura separa responsabilidades de forma clara:

* **routes** → Define los endpoints.
* **controllers** → Contienen la lógica de cada endpoint.
* **analyzers** → Procesan el código Java.
* **generators** → Crean UML, Markdown y PDF.
* **services** → Historial, IA local y almacenamiento.

---

## 4. Flujo completo del Backend

1. El usuario sube un ZIP desde el frontend.
2. El frontend envía ese ZIP a `POST /api/analyze`.
3. El backend lo guarda y lo descomprime.
4. El módulo `javaAnalyzer` analiza los `.java`.
5. El módulo `plantumlGenerator` construye los `.puml`.
6. `markdownGenerator` crea un archivo Markdown base.
7. `aiService` envía texto a la IA local y recibe descripciones enriquecidas.
8. `markdownGenerator` actualiza el Markdown final.
9. `pdfGenerator` convierte el Markdown a PDF.
10. `historyService` registra la ejecución en un archivo de historial.
11. El backend devuelve al frontend un **ID**, estadísticas y enlaces a los documentos.

---

## 5. Integración con Docker

El backend se ejecutará dentro de un contenedor Docker con:

* Node.js
* Java Runtime
* PlantUML
* Pandoc
* Dependencias del análisis

El `Setup.ps1` del proyecto:

* instalará dependencias,
* construirá la imagen Docker del backend,
* levantará los servicios junto con el frontend mediante `docker compose`.

---

## 6. Estado del desarrollo

* Sprint 6 → fase de documentación.
* No se implementan aún:

  * controladores,
  * lógica real de análisis,
  * integración con IA,
  * generación PDF.
* Este README actúa como blueprint técnico para los siguientes sprints.
