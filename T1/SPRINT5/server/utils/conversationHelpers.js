import { customAlphabet } from 'nanoid';

const conversationIdGenerator = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 18);

export const generateConversationId = () => `conv_${conversationIdGenerator()}`;

export const deriveTitleFromMessages = (messages) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'Nueva conversación';
  }

  const firstUserMessage = messages.find((message) => message.sender === 'user');
  if (!firstUserMessage || !firstUserMessage.text) {
    return 'Nueva conversación';
  }

  const trimmed = firstUserMessage.text.trim();
  return trimmed.length > 50 ? `${trimmed.slice(0, 47)}...` : trimmed;
};

export const deriveSummaryFromMessages = (messages) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'Sin mensajes aún';
  }

  const assistantMessages = messages.filter((message) => message.sender === 'bot');
  if (assistantMessages.length === 0) {
    return 'Conversación iniciada';
  }

  const latest = assistantMessages.at(-1);
  if (!latest?.text) {
    return 'Conversación iniciada';
  }

  const trimmed = latest.text.trim();
  return trimmed.length > 100 ? `${trimmed.slice(0, 97)}...` : trimmed;
};

const toIsoString = (value) => {
  if (!value) {
    return null;
  }
  return new Date(value).toISOString();
};

export const mapConversationRow = (row) => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  summary: row.summary ?? '',
  status: row.status,
  source: row.source,
  totalMessages: row.total_messages ?? 0,
  lastMessageAt: toIsoString(row.last_message_at),
  createdAt: toIsoString(row.created_at),
  updatedAt: toIsoString(row.updated_at),
});

export const mapMessageRow = (row) => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderType: row.sender_type,
  senderUserId: row.sender_user_id,
  content: row.content,
  metadata: row.metadata ? JSON.parse(row.metadata) : null,
  isError: Boolean(row.is_error),
  createdAt: toIsoString(row.created_at),
});

export const adaptMessagesForClient = (rows = []) =>
  rows.map((row) => ({
    id: row.id,
    conversationId: row.conversation_id,
    sender: row.sender_type === 'assistant' ? 'bot' : row.sender_type === 'system' ? 'system' : 'user',
    text: row.content,
    timestamp: row.createdAt ?? toIsoString(row.created_at),
    createdAt: row.createdAt ?? toIsoString(row.created_at),
    isError: Boolean(row.is_error),
  }));

export const buildConversationResponse = (row, messages = []) => {
  const base = mapConversationRow(row);
  if (messages) {
    base.messages = adaptMessagesForClient(messages);
  }
  return base;
};
