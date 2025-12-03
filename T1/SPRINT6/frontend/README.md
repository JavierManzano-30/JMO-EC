
# Frontend — Generador Automático de Documentación para Proyectos Java

Este directorio contiene el diseño técnico previsto del **frontend** del sistema de generación automática de documentación para proyectos Java, correspondiente al Sprint 6 del módulo de Entorno Cliente.

> 📌 Importante: En este sprint **no se implementa código**, solo se documenta la arquitectura, componentes y funcionamiento previsto.

---

## 1. Objetivo del Frontend

El frontend será una aplicación desarrollada con **React + TailwindCSS** que permitirá al usuario:

- Seleccionar o subir un proyecto Java comprimido (`.zip`).
- Enviar el proyecto al backend para analizarlo.
- Visualizar en tiempo real el estado del proceso (cargando, éxito, error).
- Visualizar la documentación generada:
  - Markdown renderizado en pantalla.
  - PDF descargable.
- Consultar un historial de ejecuciones anteriores.
- Acceder a los resultados de ejecuciones pasadas.

El frontend será la interfaz principal del usuario en todo el sistema.

---

## 2. Tecnologías previstas

El frontend utilizará:

- **React** → Librería para construir interfaces dinámicas y basadas en componentes.
- **Vite** → Herramienta rápida de desarrollo y bundling.
- **TailwindCSS** → Framework CSS utilitario para crear estilos de forma eficiente.
- **Fetch API / Axios** → Comunicación con el backend mediante HTTP.
- **Docker** → El frontend se ejecutará en un contenedor propio.

El frontend se expondrá en el **puerto 8978**.

---

## 3. Estructura prevista del Frontend

```text
frontend/
  src/
    main.jsx
    App.jsx
    components/
      ProjectSelector.jsx    # Selector y subida del ZIP
      StatusBanner.jsx       # Estado del proceso: cargando / error / éxito
      ResultView.jsx         # Vista de resultados
      HistoryView.jsx        # Lista de ejecuciones anteriores
      Layout.jsx             # Estructura general de la interfaz
    views/
      HomeView.jsx           # Página principal
      ResultPage.jsx         # Página de resultados (opcional según diseño)
      HistoryPage.jsx        # Página del historial
    services/
      apiClient.js           # Funciones reutilizables para llamar a la API del backend
    hooks/
      useAnalysis.js         # Hook para manejar el análisis del proyecto (opcional)
    styles/
      index.css              # Configuración de TailwindCSS
  public/
  package.json
  vite.config.js
  Dockerfile
````

Esta estructura separa:

* **Componentes reutilizables**
* **Vistas completas**
* **Servicios de comunicación**
* **Hooks de estado**
* **Estilos**

---

## 4. Componentes principales

### **ProjectSelector.jsx**

Permite seleccionar o arrastrar un archivo `.zip` con el proyecto Java.
Incluye `onChange` y manejo de validaciones básicas.

### **StatusBanner.jsx**

Muestra el estado del proceso:

* Cargando…
* Error
* Éxito
* Mensajes informativos

### **ResultView.jsx**

Muestra:

* Estadísticas básicas del análisis.
* Markdown renderizado (visor).
* Botones de descarga para PDF y Markdown.

### **HistoryView.jsx**

Lista todas las ejecuciones anteriores recuperadas desde `GET /api/history`.

Permite:

* Ver la fecha.
* Ver el nombre del proyecto.
* Consultar sus resultados.

### **Layout.jsx**

Define la estructura global de la aplicación:

* Header
* Contenido principal
* Footer

---

## 5. Vistas principales

### **Home / Selección de proyecto**

* Muestra el `ProjectSelector`.
* Botón **“Generar documentación”**.
* `StatusBanner` indicando el estado actual.
* Uso intensivo de `useState` y `onChange`.

### **Vista de resultados**

* Renderiza el Markdown generado.
* Muestra estadísticas básicas devueltas por el backend.
* Permite descargar la documentación.

### **Vista de historial**

* Llama a `GET /api/history`.
* Muestra todas las ejecuciones previas.
* Permite acceder nuevamente al PDF/Markdown generado.

---

## 6. Gestión del Estado (Hooks)

Se utilizarán los siguientes hooks:

### `useState`

Para almacenar:

* `selectedProject`
* `generationStatus` → `"idle" | "loading" | "success" | "error"`
* `currentResult` → Datos de la última ejecución
* `history` → Lista de ejecuciones previas
* `errorMessage`

### `useEffect`

* Cargar historial al iniciar la app.
* Actualizar historial tras un análisis exitoso.
* Reaccionar a cambios de estado para mostrar mensajes o redirigir.

### Comunicación por **props**

El estado principal residirá en `App.jsx`, enviando funciones a los componentes hijos:

* `onProjectSelected()`
* `onGenerate()`
* `onSelectHistoryItem()`

---

## 7. Comunicación con el Backend

El frontend se comunicará con los siguientes endpoints:

### **POST /api/analyze**

Envía el ZIP y recibe:

* ID de ejecución
* Estadísticas del análisis
* Rutas de acceso a Markdown y PDF

### **GET /api/history**

Devuelve la lista de todas las ejecuciones previas.

### **GET /api/docs/:id?format=pdf|md**

Descarga el archivo PDF o Markdown generado.

Toda esta lógica se centralizará en:

```
src/services/apiClient.js
```

---

## 8. Estilos y accesibilidad

* TailwindCSS para maquetación ágil y responsive.
* Buen contraste de colores.
* Navegación mediante teclado.
* Elementos semánticos: `<header>`, `<main>`, `<footer>`, `<section>`.

---

## 9. Dockerización

El frontend contará con su propio `Dockerfile` para:

* Instalar dependencias
* Generar la build de producción (Vite)
* Servir los archivos estáticos

El script `Setup.ps1`:

* Instalará dependencias
* Construirá la imagen Docker del frontend
* Levantará el contenedor junto con el backend usando `docker compose`

---

## 10. Estado del Desarrollo

* Este sprint cubre **solo documentación**.
* No se implementan aún:

  * componentes,
  * vistas,
  * servicios,
  * estilos,
  * integración real con la API.

Este README servirá como guía de referencia para implementar el frontend en los próximos sprints.

