const SCROLL_STORAGE_KEY = 'bubblybot.scroll';

const isBrowser = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const readStore = () => {
  if (!isBrowser()) {
    return {};
  }

  const raw = window.sessionStorage.getItem(SCROLL_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) ?? {};
  } catch (error) {
    console.warn('No se pudo leer el estado de scroll:', error);
    return {};
  }
};

const writeStore = (data) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('No se pudo guardar el estado de scroll:', error);
  }
};

export const getScrollPosition = (key) => {
  const store = readStore();
  return typeof store[key] === 'number' ? store[key] : 0;
};

export const setScrollPosition = (key, value) => {
  const store = readStore();
  store[key] = value;
  writeStore(store);
};

export const clearScrollPosition = (key) => {
  const store = readStore();
  if (Object.prototype.hasOwnProperty.call(store, key)) {
    delete store[key];
    writeStore(store);
  }
};

