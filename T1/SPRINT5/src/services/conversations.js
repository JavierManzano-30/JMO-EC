/**
 * Servicio de gestión de conversaciones con persistencia en IndexedDB
 * 
 * Este servicio proporciona una API para:
 * - Crear nuevas conversaciones
 * - Guardar mensajes en conversaciones existentes
 * - Recuperar conversaciones por ID
 * - Listar todas las conversaciones
 * - Filtrar y ordenar conversaciones
 * - Duplicar conversaciones
 * - Eliminar conversaciones
 */

const DB_NAME = 'bubblybot_conversations';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';

let dbInstance = null;

/**
 * Inicializa la base de datos IndexedDB
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB no está disponible en este entorno'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Error al abrir la base de datos: ${request.error}`));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        objectStore.createIndex('title', 'title', { unique: false });
      }
    };
  });
};

/**
 * Obtiene una instancia de la base de datos
 */
const getDB = async () => {
  if (!dbInstance) {
    await initDB();
  }
  return dbInstance;
};

/**
 * Genera un ID único para una conversación
 */
const generateId = () => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Genera un título automático basado en los primeros mensajes
 */
const generateTitle = (messages) => {
  if (!messages || messages.length === 0) {
    return 'Nueva conversación';
  }

  const firstUserMessage = messages.find((msg) => msg.sender === 'user');
  if (firstUserMessage) {
    const text = firstUserMessage.text.trim();
    if (text.length > 50) {
      return `${text.substring(0, 47)}...`;
    }
    return text;
  }

  return 'Nueva conversación';
};

/**
 * Genera un resumen de la conversación
 */
const generateSummary = (messages) => {
  if (!messages || messages.length === 0) {
    return 'Sin mensajes aún';
  }

  const botMessages = messages.filter((msg) => msg.sender === 'bot');
  if (botMessages.length > 0) {
    const lastBotMessage = botMessages[botMessages.length - 1];
    const text = lastBotMessage.text.trim();
    if (text.length > 100) {
      return `${text.substring(0, 97)}...`;
    }
    return text;
  }

  return 'Conversación iniciada';
};

/**
 * Crea una nueva conversación
 */
export const createConversation = async (initialMessages = []) => {
  try {
    const db = await getDB();
    const now = new Date().toISOString();

    const conversation = {
      id: generateId(),
      title: generateTitle(initialMessages),
      summary: generateSummary(initialMessages),
      messages: initialMessages,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(conversation);

      request.onsuccess = () => {
        updateConversationsCache();
        resolve(conversation);
      };

      request.onerror = () => {
        reject(new Error(`Error al crear la conversación: ${request.error}`));
      };
    });
  } catch (error) {
    console.error('Error en createConversation:', error);
    throw error;
  }
};

/**
 * Actualiza una conversación existente
 */
export const updateConversation = async (conversationId, updates) => {
  try {
    const db = await getDB();
    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      throw new Error(`Conversación con ID ${conversationId} no encontrada`);
    }

    const updated = {
      ...conversation,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Regenerar título y resumen si hay mensajes nuevos
    if (updates.messages) {
      updated.title = generateTitle(updates.messages);
      updated.summary = generateSummary(updates.messages);
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(updated);

      request.onsuccess = () => {
        updateConversationsCache();
        resolve(updated);
      };

      request.onerror = () => {
        reject(new Error(`Error al actualizar la conversación: ${request.error}`));
      };
    });
  } catch (error) {
    console.error('Error en updateConversation:', error);
    throw error;
  }
};

/**
 * Agrega un mensaje a una conversación
 */
export const addMessageToConversation = async (conversationId, message) => {
  try {
    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      throw new Error(`Conversación con ID ${conversationId} no encontrada`);
    }

    const updatedMessages = [...conversation.messages, message];
    return await updateConversation(conversationId, { messages: updatedMessages });
  } catch (error) {
    console.error('Error en addMessageToConversation:', error);
    throw error;
  }
};

/**
 * Obtiene una conversación por su ID
 */
export const getConversationById = async (conversationId) => {
  try {
    if (!conversationId) {
      return null;
    }

    const db = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(conversationId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error(`Error al obtener la conversación: ${request.error}`));
      };
    });
  } catch (error) {
    console.error('Error en getConversationById:', error);
    return null;
  }
};

/**
 * Obtiene todas las conversaciones
 * Filtra automáticamente las conversaciones que solo tienen mensajes del bot
 * (sin mensajes del usuario)
 */
export const getAllConversations = async () => {
  try {
    const db = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const allConversations = request.result || [];
        // Filtrar conversaciones que solo tienen mensajes del bot
        const conversationsWithUserMessages = allConversations.filter((conv) => {
          if (!conv.messages || conv.messages.length === 0) {
            return false;
          }
          // Verificar si hay al menos un mensaje del usuario
          return conv.messages.some((msg) => msg.sender === 'user');
        });
        resolve(conversationsWithUserMessages);
      };

      request.onerror = () => {
        reject(new Error(`Error al obtener las conversaciones: ${request.error}`));
      };
    });
  } catch (error) {
    console.error('Error en getAllConversations:', error);
    return [];
  }
};

/**
 * Elimina una conversación
 */
export const deleteConversation = async (conversationId) => {
  try {
    const db = await getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(conversationId);

      request.onsuccess = () => {
        updateConversationsCache();
        resolve(true);
      };

      request.onerror = () => {
        reject(new Error(`Error al eliminar la conversación: ${request.error}`));
      };
    });
  } catch (error) {
    console.error('Error en deleteConversation:', error);
    throw error;
  }
};

/**
 * Duplica una conversación
 */
export const duplicateConversation = async (conversationId) => {
  try {
    const original = await getConversationById(conversationId);
    if (!original) {
      throw new Error(`Conversación con ID ${conversationId} no encontrada`);
    }

    const duplicated = {
      ...original,
      id: generateId(),
      title: `${original.title} (copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(duplicated);

      request.onsuccess = () => {
        updateConversationsCache();
        resolve(duplicated);
      };

      request.onerror = () => {
        reject(new Error(`Error al duplicar la conversación: ${request.error}`));
      };
    });
  } catch (error) {
    console.error('Error en duplicateConversation:', error);
    throw error;
  }
};

/**
 * Filtra conversaciones por término de búsqueda
 */
export const filterConversations = (conversations, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return conversations;
  }

  const term = searchTerm.toLowerCase().trim();
  return conversations.filter((conv) => {
    const titleMatch = conv.title?.toLowerCase().includes(term);
    const summaryMatch = conv.summary?.toLowerCase().includes(term);
    const messageMatch = conv.messages?.some((msg) =>
      msg.text?.toLowerCase().includes(term)
    );
    return titleMatch || summaryMatch || messageMatch;
  });
};

/**
 * Ordena conversaciones según el criterio especificado
 */
export const sortConversations = (conversations, sortOrder = 'recent') => {
  const sorted = [...conversations];

  switch (sortOrder) {
    case 'recent':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB - dateA;
      });

    case 'oldest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.updatedAt || 0);
        return dateA - dateB;
      });

    case 'title':
      return sorted.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB);
      });

    default:
      return sorted;
  }
};

/**
 * Lista reactiva de conversaciones (para compatibilidad con código existente)
 * Esta función se actualiza dinámicamente desde IndexedDB
 */
let conversationsCache = [];
let conversationsListeners = [];

/**
 * Actualiza la caché de conversaciones
 */
const updateConversationsCache = async () => {
  try {
    const allConversations = await getAllConversations();
    conversationsCache = allConversations;
    // Notificar a todos los listeners
    conversationsListeners.forEach((listener) => {
      try {
        listener([...conversationsCache]);
      } catch (error) {
        console.error('Error en listener de conversaciones:', error);
      }
    });
  } catch (error) {
    console.error('Error al actualizar la caché de conversaciones:', error);
  }
};

/**
 * Suscribe un listener para cambios en las conversaciones
 */
export const subscribeToConversations = (listener) => {
  if (typeof listener !== 'function') {
    console.warn('subscribeToConversations: listener debe ser una función');
    return () => {};
  }

  conversationsListeners.push(listener);
  // Llamar inmediatamente con el estado actual
  if (conversationsCache.length > 0 || conversationsListeners.length === 1) {
    listener([...conversationsCache]);
  }

  return () => {
    conversationsListeners = conversationsListeners.filter((l) => l !== listener);
  };
};

// Exportar la lista de conversaciones como getter para compatibilidad
export const conversations = new Proxy([], {
  get(target, prop) {
    if (prop === 'length') {
      return conversationsCache.length;
    }
    if (typeof prop === 'string' && !isNaN(prop)) {
      return conversationsCache[parseInt(prop, 10)];
    }
    if (prop === Symbol.iterator) {
      return conversationsCache[Symbol.iterator].bind(conversationsCache);
    }
    if (prop === 'map' || prop === 'filter' || prop === 'forEach' || prop === 'find') {
      return conversationsCache[prop].bind(conversationsCache);
    }
    return conversationsCache[prop];
  },
});

/**
 * Inicializa y actualiza la caché al cargar el módulo (solo en el navegador)
 * Se hace de forma asíncrona para no bloquear la carga del módulo
 */
if (typeof window !== 'undefined') {
  // Inicializar de forma asíncrona para no bloquear
  Promise.resolve().then(() => {
    updateConversationsCache().catch((error) => {
      console.warn('Error al inicializar caché de conversaciones:', error);
    });
  });
}

