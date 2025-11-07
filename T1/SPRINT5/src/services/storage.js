const STORAGE_KEY = 'bubblybot.session';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const loadSession = () => {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('No se pudo leer la sesión almacenada:', error);
    return null;
  }
};

export const saveSession = (session) => {
  if (!isBrowser()) {
    return session;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn('No se pudo guardar la sesión local:', error);
  }

  return session;
};

export const clearSession = () => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('No se pudo limpiar la sesión local:', error);
  }
};

