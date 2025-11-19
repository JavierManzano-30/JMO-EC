# API de conversaciones (Node + Express + MySQL)

Este backend expone los datos almacenados en la base `bubblybot` creada con el script de `database/schema.sql`. Se ejecuta junto al frontend de Vite y se comunica con él mediante el proxy configurado en `vite.config.js`.

## Configuración

1. **Duplicar `.env.example`** en la raíz del proyecto y renombrarlo a `.env`.
2. Ajustar las variables de entorno:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`: credenciales de tu servidor MySQL/HeidiSQL.
   - `DB_NAME`: debe ser `bubblybot` (o el nombre que hayas usado al ejecutar `schema.sql`).
   - `DEFAULT_USER_ID`: ID del usuario que se usará por defecto para asociar las conversaciones.
   - `SERVER_PORT`: puerto en el que se ejecutará la API (por defecto `4000`).

## Ejecución

```bash
# Desde la raíz del proyecto
npm run server
```

El servidor quedará disponible en `http://localhost:4000/api`. Durante el desarrollo, Vite proxifica las peticiones del frontend a través de la ruta `/api/backend/*`.

## Endpoints principales

| Método | Ruta                                      | Descripción                                    |
|--------|-------------------------------------------|------------------------------------------------|
| GET    | `/api/health`                             | Estado del servidor.                           |
| GET    | `/api/conversations`                      | Lista de conversaciones (`?q=&sort=` opcional).|
| GET    | `/api/conversations/:id`                  | Conversación + historial completo.             |
| POST   | `/api/conversations`                      | Crea conversación (mensajes iniciales).        |
| POST   | `/api/conversations/:id/messages`         | Añade mensaje y actualiza totales.             |
| POST   | `/api/conversations/:id/duplicate`        | Duplica una conversación existente.            |
| DELETE | `/api/conversations/:id`                  | Elimina una conversación (cascade messages).   |
| POST   | `/api/auth/login`                         | Valida un usuario existente en `users`.        |

> **Nota:** Todos los endpoints actualizan automáticamente los campos `title`, `summary`, `total_messages` y timestamps según lo requerido por las vistas del Sprint 5.
