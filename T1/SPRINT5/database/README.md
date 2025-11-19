# Base de datos BubblyBot (HeidiSQL / MySQL)

Este directorio contiene todo lo necesario para crear la base de datos del sprint 5 usando HeidiSQL. El objetivo es persistir usuarios, sesiones y el historial de conversaciones generado desde la app React.

## Contenido

- `schema.sql`: script completo para recrear la base de datos `bubblybot`, sus tablas, vistas y datos de ejemplo.
- (opcional) Puedes añadir aquí futuros scripts de migración, seeds o backups exportados desde HeidiSQL.

## Pasos rápidos en HeidiSQL

1. **Abrir conexión**
   - Inicia tu servidor MySQL/MariaDB local (XAMPP, Laragon, WAMP o el que uses).
   - Abre HeidiSQL y crea/selecciona una conexión con un usuario con permisos de creación.

2. **Ejecutar el script**
   - Haz clic derecho sobre el servidor ➜ "Crear nueva" ➜ "Consulta".
   - Copia el contenido de `schema.sql` o usa `Archivo ➜ Cargar SQL` y selecciona el fichero.
   - Pulsa `F9` (o el botón "Ejecutar") para lanzar todo el script. Se recreará la BD `bubblybot` desde cero.

3. **Verificar datos**
   - Expande la nueva base de datos ➜ tablas `users`, `conversations`, `messages`.
   - Usa "Ver datos" para confirmar que los inserts de ejemplo existen.

## Tablas principales

| Tabla | Propósito | Campos clave |
| --- | --- | --- |
| `users` | Credenciales y perfil básico del alumno/usuario. | `username`, `email`, `status`, `role` |
| `sessions` | Sesiones locales (para simular login persistente). | `session_token`, `expires_at`, `device_label` |
| `conversations` | Cabeceras de cada chat. | `title`, `summary`, `total_messages`, `last_message_at` |
| `messages` | Historial completo de mensajes. | `sender_type`, `content`, `metadata` |
| `conversation_shares` | Tokens para deep-linking seguro. | `share_token`, `expires_at` |

Incluimos dos **vistas**:
- `vw_conversation_overview`: facilita listar conversaciones junto al nombre del propietario.
- `vw_message_feed`: lista plana de mensajes para reportes rápidos.

## Integración con el frontend

- El servicio actual de React (`src/services/conversations.js`) usa IndexedDB para persistencia local. Para conectar con MySQL deberías crear un backend ligero (Node/Express, Laravel, etc.) que exponga endpoints `GET/POST/PUT/DELETE` y lea/escriba en estas tablas.
- Mantén el mismo contrato que ya usa el frontend (campos `id`, `title`, `summary`, `messages`) para evitar cambios grandes en la UI.
- Para pruebas rápidas, puedes exportar los datos desde HeidiSQL a JSON y cargarlos como seed inicial en el navegador; cuando el backend esté listo, sólo cambia la capa de servicio.

## Scripts útiles

Consulta rápida de conversaciones con número de mensajes:
```sql
SELECT c.id, c.title, c.total_messages, u.display_name
FROM vw_conversation_overview c
JOIN users u ON u.id = c.user_id
ORDER BY c.updated_at DESC;
```

Buscar texto libre dentro de los mensajes (usa el índice FULLTEXT):
```sql
SELECT conversation_id, sender_type, content, created_at
FROM messages
WHERE MATCH(content) AGAINST ('+Pikachu*' IN BOOLEAN MODE)
ORDER BY created_at;
```

## Próximos pasos sugeridos

1. Generar un usuario real por cada alumno (`INSERT INTO users ...`).
2. Crear un endpoint `/api/conversations` con un backend ligero que lea/escriba en MySQL.
3. Sustituir las llamadas a IndexedDB del frontend por fetch al backend cuando esté disponible.
4. Automatizar backups exportando la BD con HeidiSQL (`Archivo ➜ Exportar base de datos como SQL`).

Con esto tendrás la base necesaria para demostrar persistencia real en HeidiSQL manteniendo el flujo funcional exigido por el sprint.
