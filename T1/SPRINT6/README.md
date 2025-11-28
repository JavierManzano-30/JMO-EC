
# 📘 Documentación – Sprint 6 (Generador Automático de Documentación Java)

Este directorio contiene **toda la documentación del Sprint 6**, centrada en el diseño completo del sistema que permitirá analizar proyectos Java y generar documentación técnica enriquecida mediante IA.

El propósito de este sprint es **documentar exhaustivamente la arquitectura, módulos, flujos y tecnologías** del sistema antes de implementarlo en sprints posteriores.

---

## 📌 Contenido del Sprint 6

| Sección | Descripción | Archivo |
|--------|-------------|---------|
| 🧱 Arquitectura General | Estructura del proyecto y sus módulos | `SPRINT6_Documentacion_Completa.pdf` |
| 🧠 Backend – Diseño Técnico | Endpoints, módulos, flujos de análisis y documentación | `SPRINT6_Documentacion_Completa.pdf` |
| 🎨 Frontend – Diseño UI/UX | Componentes, estados, hooks y estructura visual | `SPRINT6_Documentacion_Completa.pdf` |
| 🐳 Dockerización | Contenedores, servicios y orquestación | `SPRINT6_Documentacion_Completa.pdf` |
| ⚙️ Setup.ps1 | Automatización del entorno | `SPRINT6_Documentacion_Completa.pdf` |
| 🚀 Mejoras Propuestas | Mejoras futuras del sistema | `SPRINT6_Documentacion_Completa.pdf` |
| 📝 README del Sprint | Este archivo | `README.md` |

---

## 🧭 Objetivo del Proyecto

El sistema documentado permitirá:

- Analizar proyectos Java (.java)
- Obtener clases, métodos y paquetes
- Generar diagramas UML (PlantUML)
- Crear documentación técnica en Markdown
- Enriquecer el contenido mediante IA local (LMStudio)
- Convertir todo a PDF (Pandoc)
- Descargar los resultados desde un frontend React
- Mostrar un historial completo de ejecuciones

> ⚠️ **En este sprint NO se implementa nada**, solo se documenta el sistema.

---

## 🧱 Arquitectura General (resumen)

```text
Usuario
↓
Frontend (React + TailwindCSS)
↓
Backend (Node.js)
↓
Analizadores Java → Generadores UML/Markdown/PDF → IA (LMStudio)
↓
Resultados + Historial
````

---

## 🧠 Backend – Diseño Técnico

### 🔹 Endpoints definidos

| Método | Ruta            | Descripción                                       |
| ------ | --------------- | ------------------------------------------------- |
| `POST` | `/api/analyze`  | Recibe el ZIP del proyecto y genera documentación |
| `GET`  | `/api/history`  | Devuelve el historial de ejecuciones              |
| `GET`  | `/api/docs/:id` | Descarga PDF o Markdown generado                  |

### 🔹 Módulos internos

| Carpeta       | Función                        |
| ------------- | ------------------------------ |
| `analyzers/`  | Analizar código Java           |
| `generators/` | Crear UML, Markdown y PDF      |
| `services/`   | Comunicación con IA            |
| `storage/`    | Guardar historial y resultados |

---

## 🎨 Frontend – Diseño (React + TailwindCSS)

### Componentes definidos:

* `ProjectSelector.jsx`
* `StatusBanner.jsx`
* `ResultView.jsx`
* `HistoryView.jsx`
* `Layout.jsx`

### Funcionalidades obligatorias:

* Uso de `useState`
* Uso de `useEffect`
* Eventos `onClick`, `onChange`, `onSubmit`
* Lifting state up mediante props
* Renderizado condicional (cargando/error/éxito)
* Descarga PDF/MD
* Historial de ejecuciones

---

## 🐳 Docker – Estructura del sistema

### Contenedores principales:

* Backend (Node + Java + PlantUML + Pandoc)
* Frontend (React + TailwindCSS)

### Objetivos:

* Entorno reproducible
* Ejecución aislada
* Configuración mediante `docker-compose.yml`

---

## ⚙️ Script `Setup.ps1`

Automatiza:

1. Instalación del frontend
2. Instalación del backend
3. Construcción de contenedores Docker
4. Arranque completo del sistema

---

## 🚀 Mejoras Propuestas

* Estadísticas avanzadas del proyecto
* Filtros por paquete o clase
* Comparación de versiones
* Soporte para otros lenguajes (Kotlin, Python, JS)
* Sugerencias automáticas de refactorización mediante IA

---

## 📄 Documentación Completa

El documento principal del sprint es:

```
SPRINT6_Documentacion_Completa.pdf
```

Incluye:

* Portada
* Índice
* Arquitectura
* Backend documentado
* Frontend documentado
* Docker
* Setup.ps1
* Mejoras
* Conclusión

---

## 🏁 Conclusión

El Sprint 6 define totalmente **el diseño y planificación del sistema**, para que su implementación pueda comenzar sin ambigüedades en los próximos sprints.

