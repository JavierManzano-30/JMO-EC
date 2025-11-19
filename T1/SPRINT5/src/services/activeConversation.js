const STORAGE_KEY = 'bubblybot.activeConversation';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readState = () => {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) ?? {} : {};
  } catch (error) {
    console.warn('No se pudo leer el estado de conversación activa:', error);
    return {};
  }
};

const writeState = (data) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('No se pudo guardar el estado de conversación activa:', error);
  }
};

export const getActiveConversationId = (userId) => {
  if (!userId) {
    return null;
  }

  const state = readState();
  return state[userId] ?? null;
};

export const setActiveConversationId = (userId, conversationId) => {
  if (!userId) {
    return null;
  }

  const state = readState();
  if (!conversationId) {
    delete state[userId];
  } else {
    state[userId] = conversationId;
  }
  writeState(state);
  return conversationId ?? null;
};

export const clearActiveConversationId = (userId) => {
  if (!userId) {
    return;
  }
  const state = readState();
  if (state[userId]) {
    delete state[userId];
    writeState(state);
  }
};

export const clearAllActiveConversations = () => {
  if (!isBrowser()) {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('No se pudo limpiar el estado de conversaciones activas:', error);
  }
};
