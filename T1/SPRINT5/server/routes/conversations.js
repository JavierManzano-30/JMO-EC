/* eslint-env node */
import process from 'node:process';
import express from 'express';
import { pool, withConnection } from '../db.js';
import {
  generateConversationId,
  deriveTitleFromMessages,
  deriveSummaryFromMessages,
  buildConversationResponse,
} from '../utils/conversationHelpers.js';

const router = express.Router();
const DEFAULT_USER_ID = Number(process.env.DEFAULT_USER_ID ?? '1');

const BASE_SELECT = `
  SELECT
    c.id,
    c.user_id,
    c.title,
    c.summary,
    c.status,
    c.source,
    c.total_messages,
    c.last_message_at,
    c.created_at,
    c.updated_at
  FROM conversations c
`;

const fetchConversationWithMessages = async (conversationId) => {
  const [conversationRows] = await pool.query(`${BASE_SELECT} WHERE c.id = ? LIMIT 1`, [conversationId]);
  if (conversationRows.length === 0) {
    return null;
  }

  const [messageRows] = await pool.query(
    `SELECT id, conversation_id, sender_type, sender_user_id, content, metadata, is_error, created_at
     FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at ASC`,
    [conversationId],
  );

  return { conversation: conversationRows[0], messages: messageRows };
};

const parseDateOrNow = (value) => {
  if (!value) {
    return new Date();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
};

const normalizeMessagesForInsert = (messages = [], userId) =>
  messages
    .filter((message) => Boolean(message?.text))
    .map((message) => {
      const senderType =
        message.sender === 'bot' ? 'assistant' : message.sender === 'system' ? 'system' : 'user';
      return {
        senderType,
        senderUserId: senderType === 'user' ? userId : null,
        content: message.text?.trim() ?? '',
        metadata: JSON.stringify({
          clientTimestamp: message.timestamp ?? null,
        }),
        isError: message.isError ? 1 : 0,
        createdAt: parseDateOrNow(message.createdAt ?? message.timestamp),
      };
    });

router.get('/', async (req, res, next) => {
  try {
    const { q = '', sort = 'recent' } = req.query;
    const filters = ['c.status != "deleted"'];
    const params = [];

    if (q) {
      filters.push('(c.title LIKE ? OR c.summary LIKE ?)');
      const likeValue = `%${q}%`;
      params.push(likeValue, likeValue);
    }

    const sortClauses = {
      recent: 'c.updated_at DESC',
      oldest: 'c.created_at ASC',
      title: 'c.title ASC',
    };
    const orderBy = sortClauses[sort] ?? sortClauses.recent;

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const [rows] = await pool.query(
      `${BASE_SELECT} ${whereClause} ORDER BY ${orderBy}`,
      params,
    );

    res.json(rows.map((row) => buildConversationResponse(row, null)));
  } catch (error) {
    next(error);
  }
});

router.get('/:conversationId', async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const conversation = await fetchConversationWithMessages(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }

    res.json(buildConversationResponse(conversation.conversation, conversation.messages));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      userId = DEFAULT_USER_ID,
      messages = [],
      source = 'chat',
      status = 'active',
    } = req.body ?? {};

    const normalizedMessages = normalizeMessagesForInsert(messages, userId);
    const conversationId = generateConversationId();
    const now = new Date();
    const lastMessageAt = normalizedMessages.length > 0 ? normalizedMessages.at(-1).createdAt : now;

    const title = deriveTitleFromMessages(messages);
    const summary = deriveSummaryFromMessages(messages);

    await withConnection(async (connection) => {
      await connection.beginTransaction();

      await connection.query(
        `INSERT INTO conversations
          (id, user_id, title, summary, status, source, total_messages, last_message_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          conversationId,
          userId,
          title,
          summary,
          status,
          source,
          normalizedMessages.length,
          lastMessageAt,
          now,
          now,
        ],
      );

      if (normalizedMessages.length > 0) {
        const values = normalizedMessages.map((message) => [
          conversationId,
          message.senderType,
          message.senderUserId,
          message.content,
          message.metadata,
          message.isError,
          message.createdAt,
        ]);

        await connection.query(
          `INSERT INTO messages
            (conversation_id, sender_type, sender_user_id, content, metadata, is_error, created_at)
          VALUES ?`,
          [values],
        );
      }

      await connection.commit();
    });

    const created = await fetchConversationWithMessages(conversationId);
    res.status(201).json(buildConversationResponse(created.conversation, created.messages));
  } catch (error) {
    next(error);
  }
});

router.post('/:conversationId/messages', async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { sender = 'user', text = '', isError = false, timestamp = null } = req.body ?? {};
    const trimmedText = text.trim();

    if (!trimmedText) {
      return res.status(400).json({ message: 'El mensaje no puede estar vacío.' });
    }

    let responsePayload = null;
    await withConnection(async (connection) => {
      await connection.beginTransaction();
      const [[conversationRow]] = await connection.query(
        `SELECT id, user_id, title, summary, total_messages FROM conversations WHERE id = ? FOR UPDATE`,
        [conversationId],
      );

      if (!conversationRow) {
        await connection.rollback();
        return res.status(404).json({ message: 'Conversación no encontrada' });
      }

      const senderType = sender === 'bot' ? 'assistant' : sender === 'system' ? 'system' : 'user';
      let hadUserMessages = true;
      if (senderType === 'user') {
        const [[countRow]] = await connection.query(
          `SELECT COUNT(*) AS total FROM messages WHERE conversation_id = ? AND sender_type = 'user'`,
          [conversationId],
        );
        hadUserMessages = countRow.total > 0;
      }

      const createdAt = parseDateOrNow(timestamp);
      const [result] = await connection.query(
        `INSERT INTO messages
          (conversation_id, sender_type, sender_user_id, content, metadata, is_error, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          conversationId,
          senderType,
          senderType === 'user' ? conversationRow.user_id ?? DEFAULT_USER_ID : null,
          trimmedText,
          JSON.stringify({ clientTimestamp: timestamp }),
          isError ? 1 : 0,
          createdAt,
        ],
      );

      const totalMessages = (conversationRow.total_messages ?? 0) + 1;
      let nextTitle = conversationRow.title;
      if (senderType === 'user' && !hadUserMessages) {
        nextTitle = deriveTitleFromMessages([{ text: trimmedText, sender: 'user' }]);
      }

      let nextSummary = conversationRow.summary;
      if (senderType === 'assistant') {
        nextSummary = deriveSummaryFromMessages([{ text: trimmedText, sender: 'bot' }]);
      }

      await connection.query(
        `UPDATE conversations
        SET total_messages = ?, updated_at = ?, last_message_at = ?, title = ?, summary = ?
        WHERE id = ?`,
        [totalMessages, createdAt, createdAt, nextTitle, nextSummary, conversationId],
      );

      await connection.commit();

      responsePayload = {
        id: result.insertId,
        conversationId,
        sender,
        text: trimmedText,
        timestamp: createdAt.toISOString(),
        isError,
      };
    });

    if (!responsePayload) {
      return;
    }

    res.status(201).json(responsePayload);
  } catch (error) {
    next(error);
  }
});

router.post('/:conversationId/duplicate', async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const existing = await fetchConversationWithMessages(conversationId);
    if (!existing) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }

    const duplicatedId = generateConversationId();
    const now = new Date();
    const duplicateTitle = `${existing.conversation.title} (copia)`;

    await withConnection(async (connection) => {
      await connection.beginTransaction();
      await connection.query(
        `INSERT INTO conversations
        (id, user_id, title, summary, status, source, total_messages, last_message_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          duplicatedId,
          existing.conversation.user_id,
          duplicateTitle,
          existing.conversation.summary,
          existing.conversation.status,
          existing.conversation.source,
          existing.conversation.total_messages,
          existing.conversation.last_message_at ?? now,
          now,
          now,
        ],
      );

      if (existing.messages.length > 0) {
        const values = existing.messages.map((message) => [
          duplicatedId,
          message.sender_type,
          message.sender_user_id,
          message.content,
          message.metadata,
          message.is_error,
          message.created_at ?? now,
        ]);

        await connection.query(
          `INSERT INTO messages
            (conversation_id, sender_type, sender_user_id, content, metadata, is_error, created_at)
          VALUES ?`,
          [values],
        );
      }

      await connection.commit();
    });

    const duplicated = await fetchConversationWithMessages(duplicatedId);
    res.status(201).json(buildConversationResponse(duplicated.conversation, duplicated.messages));
  } catch (error) {
    next(error);
  }
});

router.delete('/:conversationId', async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const [result] = await pool.query(`DELETE FROM conversations WHERE id = ?`, [conversationId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
