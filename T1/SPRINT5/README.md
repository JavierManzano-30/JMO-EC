# 💻 SPRINT 5 – Navegación, rutas protegidas y persistencia real

Quinta iteración del proyecto **BubblyBot**. En este bloque la aplicación pasa de ser un prototipo estático a una SPA con rutas funcionales, deep-linking y persistencia real en MySQL. Cada actividad resume objetivos, archivos clave y la evidencia que queda por grabar en GIFs.

---

## 🗺️ Actividad 1 · Mapa de rutas y contenedores funcionales

**Descripción**  
Definir el layout general (cabecera + navegación + vistas) y todas las pantallas exigidas por la práctica sin depender de un router externo.

**Objetivos**
- Declarar el mapa funcional de vistas en `src/services/routes.js`.
- Renderizar cada vista desde `App.jsx` respetando el layout común.
- Contar con contenedores básicos en `src/components/Views/`.

**Archivos principales** `src/App.jsx`, `src/components/Layout/AppLayout.jsx`, `src/components/Navigation/NavBar.jsx`, `src/components/Views/*.jsx`, `src/styles/layout.css`

**Funcionalidades implementadas**
- Barra lateral con enlaces navegables mediante clic o teclado.
- Cabecera persistente con identidad BubblyBot y estado de sesión.
- Contenedores `Chat`, `Conversations`, `Conversation`, `Pokedex`, `Settings` y `Login`.

> 📹 GIF pendiente: recorrido completo por las vistas usando los botones de navegación.

---

## 🔁 Actividad 2 · Enrutado con parámetros, queries y estados

**Descripción**  
Sin usar React Router: la URL refleja qué vista está activa (`view`), qué filtros se aplican (`q`, `sort`) y qué conversación se consulta (`id`). Al recargar, la app reconstruye el estado desde esos parámetros.

**Objetivos**
- Sincronizar `window.history` desde `App.jsx` (`deriveRouteFromParams`, `sanitizeUrlForRoute`).
- `ConversationsView` maneja `?q=` y `?sort=` con `mergeSearchParams`.
- `ConversationView` lee `?id=` y muestra la conversación correspondiente.

**Archivos principales** `src/App.jsx`, `src/components/Views/ConversationsView.jsx`, `src/components/Views/ConversationView.jsx`, `src/services/urlState.js`, `src/services/url-state.md`

**Funcionalidades implementadas**
- Cambiar filtros modifica la URL con `replaceState`, evitando ensuciar el historial.
- Abrir `?view=conversation&id=...` carga la conversación al instante.
- Filtros y orden se restauran tras recargar o navegar con atrás/adelante.

> 📹 GIFs pendientes:  
> 1. Filtrar → recargar → estado intacto.  
> 2. Abrir directamente una conversación por URL.

---

## 🔒 Actividad 3 · Rutas protegidas, guards y sesiones locales

**Descripción**  
Sólo la vista pública (Login) es accesible sin sesión. El resto queda bloqueado hasta que el usuario se autentica con un nombre/contraseña existente en MySQL.

**Objetivos**
- Documentar policy en `src/components/Navigation/Guards.md`.
- Persistir sesión en `localStorage` (`src/services/storage.js`).
- Mostrar estado y acciones en `SessionIndicator`.
- Backend con `/api/auth/login` para validar usuario + hash de contraseña.

**Archivos principales** `src/App.jsx`, `src/components/Auth/LoginView.jsx`, `src/components/Auth/SessionIndicator.jsx`, `server/routes/auth.js`, `src/services/auth.js`

**Funcionalidades implementadas**
- Si un usuario sin sesión intenta abrir una vista protegida, se fuerza `view=login` con aviso.
- Tras login correcto se redirige a `chat` y se muestran las rutas protegidas.
- Logout limpia sesión y conversación activa.

> 📹 GIF pendiente: flujo completo sin sesión → bloqueo → login → navegación → logout.

---

## 🧭 Actividad 4 · Historial, restauración de scroll y foco

**Descripción**  
La app respeta el historial nativo, devuelve el foco a elementos relevantes y recuerda la posición de scroll en listados largos.

**Objetivos**
- `App.jsx` maneja `popstate` para reconstruir la vista/params.
- `ConversationsView` usa `src/services/scroll.js` y enfoca automáticamente el buscador.
- Cada vista define puntos de foco (`useRef` + `focus({ preventScroll: true })`).

**Archivos principales** `src/App.jsx`, `src/components/Views/ConversationsView.jsx`, `src/components/Views/ConversationView.jsx`, `src/components/Views/PokedexView.jsx`, `src/services/scroll.js`

**Funcionalidades implementadas**
- Botones atrás/adelante vuelven al estado exacto (incluyendo filtros).
- El listado de conversaciones restaura el scroll al volver desde un detalle.
- Chat, listados y Pokédex colocan el foco en un elemento significativo.

> 📹 GIF pendiente: bajar scroll → abrir detalle → volver → scroll restaurado.

---

## ⚠️ Actividad 5 · Errores, 404 y estados de carga homogéneos

**Descripción**  
Se estandarizan los estados de carga y error y se añade una vista 404 para rutas inexistentes.

**Objetivos**
- Componentes `Loading`, `ErrorBlock` y `NotFoundView` reutilizables.
- Manejadores de error en POKEAPI y servicios de conversaciones.
- Documentar estilos en `src/styles/layout.css` y `src/components/chatbot.css`.

**Archivos principales** `src/components/Feedback/*.jsx`, `src/components/Views/NotFoundView.jsx`, `src/components/Views/PokedexView.jsx`, `src/components/Views/ConversationsView.jsx`, `src/styles/layout.css`

**Funcionalidades implementadas**
- Mensajes amigables cuando falla la API o no existe la conversación.
- Vista 404 con enlace rápido para volver al inicio.
- Estados “Cargando…” homogéneos en listados y Pokédex.

> 📹 GIFs pendientes:  
> 1. Entrar a una URL inexistente → 404 → volver a inicio.  
> 2. Forzar fallo en POKEAPI y mostrar el bloque de error.

---

## 🧵 Actividad 6 · Deep-linking y acciones programáticas de conversación

**Descripción**  
El detalle de conversación soporta abrir una URL externa, duplicar, crear y borrar conversaciones actualizando tanto UI como base de datos.

**Objetivos**
- Servicio real (`src/services/conversations.js`) que consume la API Express/MySQL.
- Vista de detalle con duplicar/borrar + estados vacíos.
- `ChatView` y `ChatInterface` preservan la conversación activa entre pestañas.

**Archivos principales** `src/components/Views/ConversationView.jsx`, `src/components/Views/ConversationsView.jsx`, `src/components/Chatbot/*.jsx`, `src/services/conversations.js`, `server/routes/conversations.js`, `src/services/activeConversation.js`

**Funcionalidades implementadas**
- Abrir `?view=conversation&id=...` desde otra pestaña carga todo el historial.
- Botón “Nueva conversación” limpia el chat; duplicar crea un `... (copia)` y navega automáticamente.
- Si el ID no existe, muestra CTA para volver al listado.

> 📹 GIFs pendientes:  
> 1. Copiar URL de una conversación → pegar en otra pestaña → historial cargado.  
> 2. Borrar una conversación → volver al listado.

---

## 🗄️ Backend y base de datos (HeidiSQL/MySQL)

- El esquema completo vive en `database/schema.sql`. Incluye `users`, `sessions`, `conversations`, `messages`, `conversation_shares` y dos vistas para reportes.
- El backend Express (`server/index.js`) expone:
  - `/api/auth/login` para validar credenciales (texto plano o hashes bcrypt).
  - `/api/conversations` (GET/POST/DELETE) y `/messages`/`/duplicate` para gestionar el histórico.
- Archivo `.env.example` describe las variables necesarias (`DB_HOST`, `DB_USER`, `DEFAULT_USER_ID`, etc.).
- `server/README.md` documenta cómo levantarlo con `npm run server`.

---

## 🗂️ Estructura actual del proyecto
```
SPRINT5/
├── database/
│   ├── README.md                # Pasos para restaurar el schema en HeidiSQL
│   └── schema.sql
├── server/
│   ├── index.js                 # Express + rutas API
│   ├── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── conversations.js
│   └── utils/
│       └── conversationHelpers.js
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Chatbot/
│   │   ├── Feedback/
│   │   ├── Layout/
│   │   ├── Navigation/
│   │   └── Views/
│   ├── services/
│   │   ├── activeConversation.js
│   │   ├── auth.js
│   │   ├── conversations.js
│   │   ├── lmstudio.js
│   │   ├── pokeapi.js
│   │   ├── routes.js
│   │   ├── scroll.js
│   │   ├── storage.js
│   │   └── url-state.md/js
│   ├── styles/
│   │   ├── auth.css
│   │   └── layout.css
│   ├── assets/
│   │   ├── icons/
│   │   └── images/gifs/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── GUIA_PRUEBAS_ACTIVIDADES.md
└── README.md
```

---

## 🚀 Instalación y ejecución

**Requisitos**: Node.js ≥ 18, MySQL/MariaDB accesible desde HeidiSQL, LM Studio (para el servicio de chat) y un navegador moderno.

1. **Restaurar la base de datos**
   ```bash
   # Abrir HeidiSQL, ejecutar database/schema.sql y ajusta usuarios/contraseñas
   ```
2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con host, usuario y contraseña reales de MySQL
   ```
3. **Instalar dependencias**
   ```bash
   npm install
   ```
4. **Levantar backend y frontend (en terminales separadas)**
   ```bash
   npm run server   # API Express -> http://localhost:4000
   npm run dev      # Frontend Vite -> http://localhost:5173
   ```
5. **LM Studio**  
   - Ejecuta un modelo compatible y deja el servidor en `127.0.0.1:1234`.  
   - El cliente llama vía proxy a `/api/lmstudio/*` (configurado en `vite.config.js`).

> Para producción, construye con `npm run build` y sirve la carpeta `dist/`. El backend puede alojarse en la misma máquina o en un servicio Node/PM2 apuntando a la misma base de datos.

---

## 🧪 Evidencias pendientes
- GIFs de cada actividad (ver lista en `GUIA_PRUEBAS_ACTIVIDADES.md`). Guárdalos en `src/assets/images/gifs/` con los nombres que corresponden.
- Capturas/explicaciones nuevas en este README una vez generes los GIFs definitivos.

---

## ✅ Estado actual
- ✓ Navegación funcional y sincronizada con URL.  
- ✓ Guards + login real con tabla `users`.  
- ✓ Persistencia de conversaciones en MySQL + deep-linking.  
- ✓ Manejo de estados de carga, errores y 404.  
- ⏳ Falta solamente registrar la evidencia visual (GIFs) y ajustar este README si se añaden nuevas capturas.

---

✍️ **Autor:** Javier Manzano Oliveros · 2º DAW – Entorno Cliente · 2025
