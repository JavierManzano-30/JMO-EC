# 📖 Instrucciones de Uso - BubblyBot

## 🚀 Cómo ejecutar el chatbot

### Paso 1: Preparar LM Studio
1. Abre **LM Studio** en tu ordenador
2. Carga un modelo de lenguaje (cualquier modelo compatible)
3. Activa el **servidor local** en LM Studio:
   - Ve a la sección "Local Server" o "Server"
   - Configura el puerto: **1234**
   - Inicia el servidor
   - Asegúrate de que esté escuchando en `http://127.0.0.1:1234`

### Paso 2: Instalar dependencias del proyecto (solo la primera vez)
Abre una terminal en la carpeta del proyecto (`T1\SPRINT4`) y ejecuta:
```bash
npm install
```

### Paso 3: Ejecutar el chatbot
En la misma terminal, ejecuta:
```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite. Verás algo como:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Paso 4: Abrir en el navegador
1. Abre tu navegador (Chrome, Firefox, Edge, etc.)
2. Ve a la dirección que aparece en la terminal, normalmente:
   ```
   http://localhost:5173
   ```

### Paso 5: ¡Usar el chatbot!
1. Escribe tu mensaje en el cuadro de texto
2. Presiona Enter o haz clic en el botón de enviar
3. El chatbot responderá usando el modelo de LM Studio

---

## ⚙️ Configuración del servidor LM Studio

### Configuración recomendada:
- **Puerto**: 1234
- **Host**: 127.0.0.1 (localhost)
- **API compatible**: OpenAI

### Verificar que el servidor está funcionando:
Abre en tu navegador: `http://127.0.0.1:1234/v1/models`

Deberías ver un JSON con la lista de modelos disponibles.

---

## 🛠️ Comandos útiles

### Ejecutar en modo desarrollo:
```bash
npm run dev
```

### Crear versión para producción:
```bash
npm run build
```

### Verificar código (linter):
```bash
npm run lint
```

### Previsualizar versión de producción:
```bash
npm run build
npm run preview
```

---

## ❓ Solución de problemas

### Error: "No se pudo conectar con el modelo"
- Verifica que LM Studio esté ejecutándose
- Verifica que el servidor esté activo en el puerto 1234
- Asegúrate de que hay un modelo cargado en LM Studio

### Error: "npm no se reconoce"
- Asegúrate de tener Node.js instalado
- Descarga Node.js desde: https://nodejs.org/

### El chatbot no responde
- Revisa la consola del navegador (F12)
- Verifica que el servidor de LM Studio esté respondiendo
- Intenta reiniciar LM Studio y el servidor

### El puerto 1234 está ocupado
- Cambia el puerto en LM Studio a otro (ej: 1235)
- Actualiza la URL en `src/services/lmstudio.js`:
  ```javascript
  const LM_STUDIO_BASE_URL = 'http://127.0.0.1:1235';
  ```

---

## 📝 Notas importantes

- El chatbot mantiene el contexto de la conversación (últimos 10 mensajes)
- Las respuestas dependen del modelo que tengas cargado en LM Studio
- El procesamiento es local, no se envía información a internet
- Puedes usar cualquier modelo compatible con OpenAI API

---

## 🎯 Resumen rápido

1. **Abre LM Studio** → Carga modelo → Activa servidor en puerto 1234
2. **Abre terminal** en la carpeta del proyecto
3. **Ejecuta**: `npm install` (solo primera vez)
4. **Ejecuta**: `npm run dev`
5. **Abre navegador**: http://localhost:5173
6. **¡Chatea!** 💬

