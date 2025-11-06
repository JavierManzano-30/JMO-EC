# 💻 SPRINT 4 – Chatbot BubblyBot con React

Este sprint contiene el desarrollo completo de un chatbot interactivo desarrollado con React y Vite.  
El proyecto incluye integración con LM Studio para usar modelos de lenguaje locales y una interfaz de usuario moderna y responsiva.

## 🏗️ Estructura del Proyecto

```
SPRINT4/
├── src/
│   ├── components/
│   │   ├── Chatbot/
│   │   │   ├── ChatInterface.jsx    # Componente principal de la interfaz de chat
│   │   │   ├── ChatWindow.jsx       # Ventana contenedora del chat
│   │   │   ├── MessageInput.jsx     # Componente de entrada de mensajes
│   │   │   └── MessageList.jsx     # Lista de mensajes del chat
│   │   └── chatbot.css              # Estilos específicos del chatbot
│   ├── services/
│   │   └── lmstudio.js              # Servicio de integración con LM Studio
│   ├── styles/
│   │   └── layout.css               # Estilos globales de layout
│   ├── assets/
│   │   ├── icons/
│   │   │   └── bubblybot-icon.svg
│   │   └── images/
│   │       └── bubblybot-logo.svg
│   ├── public/
│   │   ├── favicon.svg              # Favicon de la aplicación
│   │   └── vite.svg                 # Logo de Vite
│   ├── App.jsx                      # Componente raíz de la aplicación
│   ├── App.css                      # Estilos del componente App
│   ├── main.jsx                     # Punto de entrada de la aplicación
│   └── index.css                    # Estilos globales base
├── package.json                     # Configuración de dependencias y scripts
├── package-lock.json                # Lock de versiones de dependencias
├── vite.config.js                   # Configuración de Vite
├── eslint.config.js                 # Configuración de ESLint
├── index.html                       # Página HTML principal
├── README.md                        # Este archivo
└── INSTRUCCIONES_USO.md             # Instrucciones de uso del chatbot
```

---

## 🚀 Instalación y Uso

### Requisitos previos:
- Node.js (versión 16 o superior)
- npm o yarn
- LM Studio instalado y configurado

### Instalación:
```bash
# Navegar al directorio del proyecto
cd SPRINT4

# Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo
npm run dev
```

### Acceso:
- Abrir el navegador en `http://localhost:5173` (o el puerto que indique Vite)
- El chatbot estará disponible y funcionando

**Nota:** Asegúrate de tener LM Studio ejecutándose con el servidor local activo en el puerto 1234 antes de usar el chatbot.

---

## 🎯 Características Principales

### **🤖 Chatbot BubblyBot:**
- Interfaz de chat moderna y responsiva
- Integración con LM Studio para modelos de lenguaje locales
- Mantenimiento del contexto de conversación
- Manejo de errores robusto
- Diseño visual atractivo

### **💬 Funcionalidades:**
- Conversaciones naturales con el modelo de lenguaje
- Respuestas contextuales basadas en el historial
- Indicador de "pensando..." durante el procesamiento
- Interfaz intuitiva y fácil de usar

### **🎨 Diseño y UX:**
- Interfaz responsiva para móviles y desktop
- Scroll automático en el área de mensajes
- Animaciones suaves y transiciones
- Colores y tema visual coherentes
- Experiencia de usuario intuitiva

### **⚙️ Arquitectura Técnica:**
- React con Vite para desarrollo rápido
- Componentes modulares y reutilizables
- Servicios separados para lógica de negocio
- Estilos centralizados y organizados
- Estructura escalable y mantenible

---

## 📋 Tecnologías Utilizadas

- **Frontend:** React 19 + Vite
- **Estilos:** CSS3 con Flexbox y Grid
- **API:** LM Studio (OpenAI-compatible API)
- **Herramientas:** Node.js, npm, ESLint
- **Desarrollo:** Servidor de desarrollo Vite

---

## 📖 Documentación Adicional

Para más detalles sobre cómo usar el chatbot, consulta el archivo `INSTRUCCIONES_USO.md`.

---

✍️ **Autor:** *Javier Manzano Oliveros*  
📆 **Fecha:** *2025*  
🏫 **Módulo:** *Entorno Cliente – 2º DAW*  
🎯 **Proyecto:** *Chatbot BubblyBot con React*
