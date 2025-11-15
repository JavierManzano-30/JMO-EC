# 📋 Guía de Pruebas por Actividad - SPRINT 5

Esta guía te ayudará a probar cada actividad paso a paso y crear los GIFs necesarios.

---

## 📌 Actividad 1: Mapa de rutas y contenedores funcionales

### ✅ Estado: COMPLETADO

### 🧪 Pruebas Funcionales a Realizar:

1. **Navegación entre vistas**
   - Inicia sesión (si no estás autenticado)
   - Haz clic en cada enlace de la barra de navegación:
     - Inicio / Chat
     - Conversaciones
     - Pokédex
     - Ajustes
   - Verifica que cada clic cambia la vista correctamente
   - Verifica que la cabecera se mantiene estable (no desaparece)

2. **Navegación con teclado**
   - Usa Tab para navegar entre los enlaces
   - Presiona Enter/Space en cada enlace para activarlo
   - Verifica que funciona correctamente

3. **GIF a crear:**
   - Recorrido por todas las vistas usando la propia navegación
   - Muestra: clic en cada enlace → cambio de vista → cabecera estable

### 📝 Checklist:
- [ ] Todos los enlaces cambian la vista
- [ ] La cabecera permanece visible
- [ ] Navegación con teclado funciona
- [ ] GIF creado: `ejercicio1.mp4` o similar

---

## 📌 Actividad 2: Enrutado con parámetros, queries y estados

### ✅ Estado: COMPLETADO

### 🧪 Pruebas Funcionales a Realizar:

1. **Parámetros de ruta - Conversación por ID**
   - Ve a Conversaciones
   - Haz clic en "Ver conversación" de alguna conversación
   - Verifica que la URL cambia a `?view=conversation&id=XXX`
   - Recarga la página con esa URL
   - Verifica que se carga la conversación correcta

2. **Query params - Búsqueda en Conversaciones**
   - Ve a Conversaciones
   - Escribe algo en el campo de búsqueda (ej: "test")
   - Verifica que la URL cambia a `?view=conversations&q=test`
   - Limpia la búsqueda
   - Verifica que el parámetro `q` desaparece de la URL

3. **Query params - Orden en Conversaciones**
   - Ve a Conversaciones
   - Cambia el orden (ej: "Más antiguas")
   - Verifica que la URL cambia a `?view=conversations&sort=oldest`
   - Cambia a otro orden
   - Verifica que el parámetro `sort` se actualiza

4. **Sincronía URL ⇄ Estado**
   - Abre una URL directamente: `?view=conversations&q=test&sort=oldest`
   - Verifica que se aplican los filtros automáticamente
   - Recarga la página
   - Verifica que los filtros se mantienen

5. **GIFs a crear:**
   - GIF 1: Filtrar con query param → recargar → se mantiene
   - GIF 2: Abrir conversación por URL directamente

### 📝 Checklist:
- [ ] Parámetro `id` funciona en ConversationView
- [ ] Query `q` actualiza la URL al buscar
- [ ] Query `sort` actualiza la URL al ordenar
- [ ] Abrir URL con parámetros restaura el estado
- [ ] GIF 1 creado: filtrar → recargar → mantiene estado
- [ ] GIF 2 creado: abrir conversación por URL

---

## 📌 Actividad 3: Rutas "protegidas" en cliente (guards) y redirecciones

### ✅ Estado: COMPLETADO

### 🧪 Pruebas Funcionales a Realizar:

1. **Sin sesión - Bloqueo de acceso**
   - Cierra sesión (si estás autenticado)
   - Intenta hacer clic en "Conversaciones" o "Chat"
   - Verifica que te redirige a la vista de Login
   - Verifica que aparece un mensaje indicando que necesitas sesión

2. **Con sesión - Acceso permitido**
   - Inicia sesión
   - Accede a cualquier vista protegida (Chat, Conversaciones, Pokédex, Ajustes)
   - Verifica que todas funcionan correctamente

3. **Redirecciones predecibles**
   - Sin sesión, intenta acceder a Chat
   - Inicia sesión
   - Verifica que te lleva automáticamente a Chat
   - Cierra sesión
   - Verifica que te redirige a Login

4. **GIF a crear:**
   - Intento sin sesión → bloqueo funcional → login simulado → acceso → logout

### 📝 Checklist:
- [ ] Sin sesión: intento de acceso bloqueado
- [ ] Con sesión: todas las vistas funcionan
- [ ] Tras login: redirección a Chat
- [ ] Tras logout: redirección a Login
- [ ] GIF creado: flujo completo de autenticación

---

## 📌 Actividad 4: Gestión del historial, restauración de scroll y foco

### ✅ Estado: COMPLETADO

### 🧪 Pruebas Funcionales a Realizar:

1. **Comportamiento del historial**
   - Navega: Chat → Conversaciones → Pokédex
   - Usa el botón "Atrás" del navegador
   - Verifica que vuelves a Conversaciones
   - Usa "Atrás" de nuevo
   - Verifica que vuelves a Chat
   - Usa "Adelante"
   - Verifica que avanzas correctamente

2. **Restauración de scroll**
   - Ve a Conversaciones
   - Si hay muchas conversaciones, baja el scroll
   - Haz clic en "Ver conversación" de alguna
   - Usa "Atrás" del navegador
   - Verifica que el scroll se restaura en la misma posición

3. **Foco funcional**
   - Entra a Chat
   - Verifica que el foco va al input de mensaje
   - Cambia a Conversaciones
   - Verifica que el foco va al campo de búsqueda
   - Cambia a Pokédex
   - Verifica que el foco va al título

4. **GIF a crear:**
   - Navegar a listado → bajar scroll → ir a detalle → volver → scroll restaurado

### 📝 Checklist:
- [ ] Botones Atrás/Adelante funcionan
- [ ] El scroll se restaura al volver
- [ ] El foco cae en el elemento esperado
- [ ] GIF creado: scroll restaurado

---

## 📌 Actividad 5: Errores, 404 y estados de carga unificados

### ✅ Estado: COMPLETADO

### 🧪 Pruebas Funcionales a Realizar:

1. **Vista 404**
   - Escribe una URL inválida: `?view=noexiste`
   - Verifica que aparece la vista 404
   - Verifica que hay un enlace para volver a Inicio/Chat
   - Haz clic en el enlace
   - Verifica que vuelves a Chat

2. **Estados de carga - ConversationsView**
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña Network
   - Activa "Slow 3G" o "Offline" temporalmente
   - Ve a Conversaciones
   - Verifica que aparece "Cargando conversaciones..."
   - (Opcional: puedes simular un delay en el código)

3. **Estados de carga - PokedexView**
   - Ve a Pokédex
   - Verifica que aparece "Cargando Pokémon..." brevemente
   - Verifica que luego se muestran los Pokémon

4. **Captura de error - POKEAPI**
   - Ve a Pokédex
   - Si hay conexión, debería cargar correctamente
   - Para probar el error: desconecta internet o modifica temporalmente la URL de la API
   - Verifica que aparece un bloque de error
   - Verifica que hay un botón "Reintentar"
   - Verifica que la navegación sigue funcionando

5. **GIFs a crear:**
   - GIF 1: URL inexistente → 404 → volver a inicio
   - GIF 2: Forzar un error de API y ver el manejo

### 📝 Checklist:
- [ ] URL desconocida muestra 404
- [ ] Estados de carga visibles
- [ ] Error de POKEAPI muestra bloque de error
- [ ] La navegación no se rompe con errores
- [ ] GIF 1 creado: 404 → volver
- [ ] GIF 2 creado: manejo de error

---

## 📌 Actividad 6: Deep-linking de conversación y acciones de navegación programática

### ✅ Estado: COMPLETADO

### 🧪 Pruebas Funcionales a Realizar:

1. **Abrir conversación por URL**
   - Crea una conversación en el chat (envía algunos mensajes)
   - Ve a Conversaciones
   - Copia la URL de una conversación (o anota el ID)
   - Abre una nueva pestaña
   - Pega la URL con `?view=conversation&id=XXX`
   - Verifica que se carga el historial completo

2. **Nueva conversación**
   - Ve a Chat
   - Haz clic en "Nueva conversación"
   - Verifica que se resetea el chat
   - Envía un mensaje
   - Verifica que se crea una nueva conversación

3. **Duplicar conversación**
   - Ve a Conversaciones
   - Abre una conversación
   - Haz clic en "Duplicar"
   - Verifica que se crea una copia
   - Verifica que navegas a la conversación duplicada
   - Verifica que el título tiene "(copia)"

4. **Borrar conversación**
   - Ve a una conversación
   - Haz clic en "Eliminar"
   - Confirma la eliminación
   - Verifica que vuelves al listado de conversaciones
   - Verifica que la conversación ya no aparece

5. **Estado vacío - Conversación inexistente**
   - Abre una URL con un ID que no existe: `?view=conversation&id=noexiste123`
   - Verifica que aparece "Conversación no encontrada"
   - Verifica que hay un botón para volver al listado

6. **GIFs a crear:**
   - GIF 1: Copiar URL → pegar en otra pestaña → conversación carga
   - GIF 2: Borrar → volver a listado

### 📝 Checklist:
- [ ] Abrir por URL funciona
- [ ] Nueva conversación resetea el chat
- [ ] Duplicar crea copia y navega
- [ ] Borrar elimina y vuelve al listado
- [ ] Conversación inexistente muestra estado apropiado
- [ ] GIF 1 creado: deep-linking
- [ ] GIF 2 creado: borrar conversación

---

## 🎬 Consejos para crear los GIFs:

1. **Herramientas recomendadas:**
   - Windows: ScreenToGif, ShareX, o la herramienta de captura de Windows
   - Mac: GIPHY Capture, Kap
   - Navegador: Extensiones como "GIF Screen Recorder"

2. **Configuración recomendada:**
   - FPS: 10-15 (suficiente para demostraciones)
   - Resolución: 1280x720 o similar
   - Duración: 10-30 segundos por GIF

3. **Antes de grabar:**
   - Limpia el navegador (o usa modo incógnito)
   - Prepara los datos necesarios (conversaciones, etc.)
   - Asegúrate de que la aplicación funciona correctamente

4. **Durante la grabación:**
   - Muévete lentamente para que se vea claro
   - Resalta las acciones importantes (clics, cambios de URL, etc.)
   - Muestra la barra de direcciones cuando sea relevante

---

## 📂 Estructura de archivos para GIFs:

Guarda los GIFs en: `src/assets/images/gifs/`

Nombres sugeridos:
- `actividad1_navegacion.mp4` o `.gif`
- `actividad2_query_params.mp4`
- `actividad2_deep_link.mp4`
- `actividad3_guards.mp4`
- `actividad4_historial_scroll.mp4`
- `actividad5_404.mp4`
- `actividad5_errores.mp4`
- `actividad6_deep_linking.mp4`
- `actividad6_acciones.mp4`

---

## ✅ Verificación Final:

Antes de considerar completada cada actividad, verifica:

1. ✅ Todas las pruebas funcionales pasan
2. ✅ Los GIFs están creados y guardados
3. ✅ La documentación está actualizada (si aplica)
4. ✅ No hay errores en la consola del navegador
5. ✅ La funcionalidad es estable y predecible

---

**¡Buena suerte con las pruebas! 🚀**

