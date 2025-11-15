import {
  ChatView,
  ConversationsView,
  ConversationView,
  PokedexView,
  SettingsView,
  NotFoundView,
} from '../components/Views';
import LoginView from '../components/Auth/LoginView';

/**
 * Mapa funcional de rutas disponibles en la aplicación.
 * Cada entrada describe una "pantalla" obligatoria para el usuario.
 */
export const ROUTE_LIST = Object.freeze([
  {
    id: 'login',
    label: 'Acceso',
    description: 'Inicia sesión local para desbloquear el asistente.',
    isPublic: true,
    hideWhenAuthenticated: true,
  },
  {
    id: 'chat',
    label: 'Inicio / Chat',
    description: 'Vista principal de conversación con BubblyBot.',
    requiresSession: true,
  },
  {
    id: 'conversations',
    label: 'Conversaciones',
    description: 'Listado de conversaciones anteriores guardadas.',
    requiresSession: true,
  },
  {
    id: 'conversation',
    label: 'Conversación',
    description: 'Detalle con el historial de una conversación específica.',
    requiresSession: true,
  },
  {
    id: 'pokedex',
    label: 'Pokédex',
    description: 'Demostrador de la integración con la POKEAPI existente.',
    requiresSession: true,
  },
  {
    id: 'settings',
    label: 'Ajustes',
    description: 'Preferencias del asistente y configuración del modelo.',
    requiresSession: true,
  },
]);

export const ROUTE_MAP = Object.freeze(
  Object.fromEntries(ROUTE_LIST.map((route) => [route.id, route])),
);

export const ROUTE_COMPONENTS = Object.freeze({
  login: LoginView,
  chat: ChatView,
  conversations: ConversationsView,
  conversation: ConversationView,
  pokedex: PokedexView,
  settings: SettingsView,
  notfound: NotFoundView,
});

export const DEFAULT_ROUTE_ID = 'chat';
export const PUBLIC_ROUTE_ID = 'login';

