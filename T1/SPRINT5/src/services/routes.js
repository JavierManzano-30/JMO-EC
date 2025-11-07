import {
  ChatView,
  ConversationsView,
  ConversationView,
  PokedexView,
  SettingsView,
} from '../components/Views';

/**
 * Mapa funcional de rutas disponibles en la aplicación.
 * Cada entrada describe una "pantalla" obligatoria para el usuario.
 */
export const ROUTE_LIST = Object.freeze([
  {
    id: 'chat',
    label: 'Inicio / Chat',
    description: 'Vista principal de conversación con BubblyBot.',
  },
  {
    id: 'conversations',
    label: 'Conversaciones',
    description: 'Listado de conversaciones anteriores guardadas.',
  },
  {
    id: 'conversation',
    label: 'Conversación',
    description: 'Detalle con el historial de una conversación específica.',
  },
  {
    id: 'pokedex',
    label: 'Pokédex',
    description: 'Demostrador de la integración con la POKEAPI existente.',
  },
  {
    id: 'settings',
    label: 'Ajustes',
    description: 'Preferencias del asistente y configuración del modelo.',
  },
]);

export const ROUTE_MAP = ROUTE_LIST.reduce((map, route) => {
  // eslint-disable-next-line no-param-reassign
  map[route.id] = route;
  return map;
}, {});

export const ROUTE_COMPONENTS = Object.freeze({
  chat: ChatView,
  conversations: ConversationsView,
  conversation: ConversationView,
  pokedex: PokedexView,
  settings: SettingsView,
});

export const DEFAULT_ROUTE_ID = 'chat';

