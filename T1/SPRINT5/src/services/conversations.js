const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL ?? '/api/backend';

const safeFetch = async (input, init) => {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error('Error al contactar con el backend de conversaciones:', error);
    throw new Error(
      'No se pudo conectar con el servidor de datos. Verifica que el backend esté en ejecución.',
    );
  }
};

const formatTimestamp = (value) => {
  if (!value) {
    return '';
  }

  try {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch (error) {
    console.warn('No se pudo formatear la fecha:', error);
    return value;
  }
};

const mapMessage = (rawMessage) => {
  if (!rawMessage) {
    return null;
  }

  const timestamp = rawMessage.timestamp ?? rawMessage.createdAt ?? rawMessage.created_at;
  const sender =
    rawMessage.sender ??
    (rawMessage.senderType === 'assistant'
      ? 'bot'
      : rawMessage.senderType === 'system'
        ? 'system'
        : rawMessage.senderType === 'user'
          ? 'user'
          : rawMessage.sender ?? 'user');

  return {
    id: rawMessage.id,
    conversationId: rawMessage.conversationId ?? rawMessage.conversation_id ?? null,
    sender,
    text: rawMessage.text ?? rawMessage.content ?? '',
    timestamp: formatTimestamp(timestamp),
    createdAt: timestamp ?? null,
    isError: Boolean(rawMessage.isError ?? rawMessage.is_error),
  };
};

const mapConversation = (rawConversation, { includeMessages = false } = {}) => {
  const base = {
    id: rawConversation.id,
    userId: rawConversation.userId ?? rawConversation.user_id,
    title: rawConversation.title,
    summary: rawConversation.summary ?? '',
    status: rawConversation.status,
    source: rawConversation.source,
    totalMessages: rawConversation.totalMessages ?? rawConversation.total_messages ?? 0,
    lastMessageAt: rawConversation.lastMessageAt ?? rawConversation.last_message_at ?? null,
    createdAt: rawConversation.createdAt ?? rawConversation.created_at ?? null,
    updatedAt: rawConversation.updatedAt ?? rawConversation.updated_at ?? null,
  };

  if (includeMessages) {
    base.messages = Array.isArray(rawConversation.messages)
      ? rawConversation.messages.map(mapMessage).filter(Boolean)
      : [];
  }

  return base;
};

const handleResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      payload?.message ?? 'No se pudo completar la operación en el servidor de conversaciones.';
    throw new Error(message);
  }

  return payload;
};

const buildQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );

  if (entries.length === 0) {
    return '';
  }

  const searchParams = new URLSearchParams();
  entries.forEach(([key, value]) => searchParams.append(key, value));
  return `?${searchParams.toString()}`;
};

export const getAllConversations = async ({ q = '', sort = 'recent', signal } = {}) => {
  const query = buildQueryString({ q, sort });
  const response = await safeFetch(`${API_BASE_URL}/conversations${query}`, { signal });
  const data = await handleResponse(response);
  return Array.isArray(data) ? data.map((item) => mapConversation(item)) : [];
};

export const getConversationById = async (conversationId) => {
  if (!conversationId) {
    return null;
  }

  const response = await safeFetch(`${API_BASE_URL}/conversations/${conversationId}`);
  const data = await handleResponse(response);
  return data ? mapConversation(data, { includeMessages: true }) : null;
};

export const createConversation = async (initialMessages = [], { userId } = {}) => {
  const response = await safeFetch(`${API_BASE_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      messages: initialMessages,
    }),
  });

  const data = await handleResponse(response);
  return data ? mapConversation(data, { includeMessages: true }) : null;
};

export const addMessageToConversation = async (conversationId, message) => {
  if (!conversationId) {
    throw new Error('conversationId es obligatorio para agregar mensajes.');
  }

  const response = await safeFetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  return handleResponse(response);
};

export const deleteConversation = async (conversationId) => {
  if (!conversationId) {
    return false;
  }

  const response = await safeFetch(`${API_BASE_URL}/conversations/${conversationId}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    return true;
  }

  await handleResponse(response);
  return true;
};

export const duplicateConversation = async (conversationId) => {
  if (!conversationId) {
    throw new Error('Necesitas un ID de conversación para crear una copia.');
  }

  const response = await safeFetch(`${API_BASE_URL}/conversations/${conversationId}/duplicate`, {
    method: 'POST',
  });

  const data = await handleResponse(response);
  return data ? mapConversation(data, { includeMessages: true }) : null;
};
