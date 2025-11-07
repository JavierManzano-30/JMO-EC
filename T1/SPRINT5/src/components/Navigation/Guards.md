# Política de acceso y guardias

## Roles y alcance

- **Sesión local**: estado booleano simulado que se guarda en `localStorage`. Se considera autenticado cuando `session.isAuthenticated = true`.
- **Usuario sin sesión**: sólo puede ver la pantalla de acceso (`view=login`).

## Clasificación de vistas

| Vista            | Ruta (`view`) | Requiere sesión | Notas |
|------------------|---------------|-----------------|-------|
| Acceso           | `login`       | No              | Vista pública para iniciar sesión local. |
| Chat             | `chat`        | Sí              | Destino principal tras iniciar sesión. |
| Conversaciones   | `conversations` | Sí            | Respeta `q` y `sort` sólo cuando hay sesión. |
| Conversación     | `conversation` | Sí             | Muestra detalle de conversación por `id`. |
| Pokédex          | `pokedex`     | Sí              | Requiere sesión para reutilizar datos previos. |
| Ajustes          | `settings`    | Sí              | Solo visible cuando hay sesión. |

## Reglas de guardia

1. **Bloqueo preventivo**: si se intenta navegar a una vista que `requiresSession` y no existe sesión, se redirige automáticamente a `login` y se muestra un mensaje funcional.
2. **Persistencia**: el estado de sesión se guarda en `localStorage` (`services/storage.js`). Al recargar se restaura automáticamente.
3. **Redirecciones**:
   - Tras iniciar sesión correctamente, se navega a `chat` (limpiando parámetros que no aplican).
   - Al cerrar sesión se redirige a `login` y se eliminan los parámetros relacionados.
4. **Historial del navegador**: las redirecciones forzadas se realizan con `replaceState` cuando procede para evitar entradas redundantes en el historial.

## Mensajes al usuario

- Se muestra un aviso en la vista de acceso indicando que la vista solicitada requiere sesión cuando el guardia bloquea la navegación.
- El encabezado de la aplicación incluye `SessionIndicator`, que refleja si hay o no sesión activa y expone acciones rápidas para iniciar/cerrar sesión.

