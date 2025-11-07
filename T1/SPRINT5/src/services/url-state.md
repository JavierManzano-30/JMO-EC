# Estado de la URL

La aplicación sincroniza el estado de navegación con la barra de direcciones para poder compartir enlaces directos.

## Parámetros soportados

- `view`: identifica la "pantalla" activa. Valores posibles: `chat`, `conversations`, `conversation`, `pokedex`, `settings`.
- `id`: identificador de la conversación abierta en la vista `conversation`.
- `q`: término de búsqueda aplicado en `conversations`.
- `sort`: criterio de orden en `conversations`. Valores soportados: `recent`, `oldest`, `title`.

## Reglas

1. Cada cambio de navegación actualiza `view` para reflejar la pantalla activa.
2. `id` sólo se mantiene cuando `view = conversation`.
3. `q` y `sort` se leen únicamente en `conversations`; pueden permanecer en la URL para conservar filtros al volver al listado.
4. `ConversationsView` escribe los parámetros con `replaceState` para no saturar el historial mientras se escribe.
5. Abrir una URL con cualquiera de estos parámetros restaura el estado inicial de la aplicación.

