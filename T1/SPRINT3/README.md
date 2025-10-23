# 💻 SPRINT 3 – Desarrollo Full-Stack (2º DAW)

Este sprint contiene los ejercicios prácticos de desarrollo full-stack con integración de frontend y backend, incluyendo gestión de base de datos MySQL.

## 📁 Estructura del Proyecto

```
SPRINT3/
├── EJ1/                    # Ejercicio 1: Contrarreloj
│   ├── ejercicio1.html
│   └── ejercicio1.js
├── EJ2/                    # Ejercicio 2: Calculadora Básica
│   ├── ejercicio2.html
│   └── ejercicio2.js
├── EJ3/                    # Ejercicio 3: Gestión de Guild Members
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   └── PROBLEMA_ESQUEMA_BD.md
├── EJ4/                    # Ejercicio 4: Party Finder Básico
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   ├── PROBLEMA_SOLUCIONADO.md
│   └── SOLUCION_BACKEND_PROFESOR.md
├── EJ5/                    # Ejercicio 5: Party Finder Avanzado
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   ├── README.md
│   └── backend/
│       ├── server.js
│       ├── package.json
│       └── node_modules/
├── Cosas/                  # Backend del Profesor (Problemático)
│   ├── guild-management-BackEnd.exe
│   ├── guild-management-api.yml
│   └── EJ3/backend/
└── gifs/                   # Demostraciones visuales
    ├── ejercicio3.1.gif
    ├── ejercicio3.2.gif
    ├── ejercicio3.3.gif
    ├── ejercicio3.4.gif
    ├── ejercicio3.5.gif
    ├── ejercicio3.6.gif
    ├── ejercicio4.1.gif
    ├── ejercicio4.2.gif
    ├── ejercicio4.3.gif
    ├── ejercicio4.4.gif
    └── ejercicio4.5.gif
```

## 🎯 Ejercicios Implementados

### **EJ1: Contrarreloj**
- Temporizador que cuenta hacia atrás
- Manejo de eventos y manipulación del DOM
- Uso de `setInterval` y `clearInterval`

### **EJ2: Calculadora Básica**
- Operaciones aritméticas básicas
- Validación de entradas
- Manejo de errores (división por cero)

### **EJ3: Gestión de Guild Members**
- **Frontend:** Interfaz completa para gestión de miembros
- **Backend:** Integración con MySQL del profesor
- **Funcionalidades:** CRUD completo de usuarios
- **Base de datos:** Tabla `guildmembers`

### **EJ4: Party Finder Básico**
- **Frontend:** Creación y gestión de parties
- **Backend:** Integración con MySQL del profesor
- **Funcionalidades:** Crear parties de tamaño 3, 5, 8
- **Base de datos:** Tablas `partyfinderthree`, `partyfinderfive`, `partyfindereight`

### **EJ5: Party Finder Avanzado**
- **Frontend:** Gestión avanzada de parties con interfaz mejorada
- **Backend:** Servidor Node.js propio con MySQL
- **Funcionalidades:** 
  - Crear usuarios y parties
  - Añadir/remover miembros
  - Eliminar parties
  - Validaciones avanzadas
- **Base de datos:** Mismas tablas que EJ3/EJ4 (unificada)

## 🗄️ Base de Datos MySQL

### **Configuración:**
- **Host:** localhost:3306
- **Usuario:** root (sin contraseña)
- **Base de datos:** guildmanagement

### **Tablas:**
- `guildmembers` - Usuarios del sistema
- `partyfinderthree` - Parties de tamaño 3
- `partyfinderfive` - Parties de tamaño 5
- `partyfindereight` - Parties de tamaño 8

## 🚀 Cómo Ejecutar

### **EJ1 y EJ2:**
```bash
# Abrir directamente en el navegador
open EJ1/ejercicio1.html
open EJ2/ejercicio2.html
```

### **EJ3 y EJ4:**
```bash
# Requiere backend del profesor (problemático)
cd Cosas
./guild-management-BackEnd.exe  # Puede fallar con ETIMEDOUT
# Luego abrir EJ3/index.html o EJ4/index.html
```

### **EJ5 (Recomendado):**
```bash
# Usar el backend funcional propio
cd EJ5/backend
npm install
npm start
# Luego abrir EJ5/index.html
```

## ⚠️ Problemas Conocidos

### **Backend del Profesor:**
- Error `ETIMEDOUT` al conectar a MySQL
- Requiere configuración específica no documentada
- **Solución:** Usar el backend propio de EJ5

### **Integración:**
- EJ3/EJ4 dependen del backend del profesor
- EJ5 tiene backend propio funcional
- Los datos se pueden compartir usando la misma base de datos MySQL

## 🎉 Funcionalidades Destacadas

✅ **Sistema completo** de gestión de guilds  
✅ **Base de datos MySQL** integrada  
✅ **Frontend responsivo** con validaciones  
✅ **Backend robusto** con manejo de errores  
✅ **Integración** entre ejercicios  
✅ **Documentación completa** de problemas y soluciones  

## 📊 Demostraciones

Los GIFs en la carpeta `gifs/` muestran el funcionamiento de cada ejercicio:
- `ejercicio3.1.gif` a `ejercicio3.6.gif` - Funcionalidades de EJ3
- `ejercicio4.1.gif` a `ejercicio4.5.gif` - Funcionalidades de EJ4

---

✍️ **Autor:** Javier Manzano Oliveros  
📆 **Fecha:** Octubre 2025  
🏫 **Módulo:** Entorno Cliente – 2º DAW  
🎯 **Sprint:** SPRINT 3 - Desarrollo Full-Stack
