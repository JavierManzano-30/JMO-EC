import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getConversationById } from '../../services/conversations';
import { readSearchParams } from '../../services/urlState';

const formatDateTime = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const ConversationView = ({ navigate }) => {
  const [conversationId, setConversationId] = useState(null);
  const headingRef = useRef(null);

  const syncFromUrl = useCallback(() => {
    const params = readSearchParams();
    const urlId = params.get('id');
    setConversationId(urlId);
  }, []);

  useEffect(() => {
    syncFromUrl();
    const handlePopstate = () => {
      syncFromUrl();
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [syncFromUrl]);

  const conversation = useMemo(() => {
    if (!conversationId) {
      return null;
    }

    return getConversationById(conversationId);
  }, [conversationId]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [conversationId]);

  const handleGoToList = () => {
    navigate?.('conversations');
  };

  const senderLabel = (sender) => (sender === 'bot' ? 'BubblyBot' : 'Tú');

  return (
    <section className="view-section" aria-labelledby="conversation-view-title">
      <header className="view-header">
        <h2 id="conversation-view-title" ref={headingRef} tabIndex={-1}>
          Detalle de la conversación
        </h2>
        <p>Revisa el historial completo y retoma el hilo en el punto exacto donde lo dejaste.</p>
      </header>

      <div className="view-content view-content--conversation">
        {!conversationId && (
          <div className="conversation-placeholder">
            <p>Selecciona una conversación desde el listado para ver los mensajes.</p>
            <button type="button" className="primary-button" onClick={handleGoToList}>
              Ver conversaciones
            </button>
          </div>
        )}

        {conversationId && !conversation && (
          <div className="conversation-placeholder">
            <p>No se encontró una conversación con el identificador proporcionado.</p>
            <button type="button" className="primary-button" onClick={handleGoToList}>
              Volver al listado
            </button>
          </div>
        )}

        {conversation && (
          <div className="conversation-detail">
            <div className="conversation-detail__meta">
              <h3>{conversation.title}</h3>
              <p>{conversation.summary}</p>
              <span className="conversation-detail__timestamp">
                Última actualización: {formatDateTime(conversation.updatedAt)}
              </span>
            </div>

            <ol className="message-history">
              {conversation.messages.map((msg) => (
                <li key={msg.id} className={`message-history__item message-history__item--${msg.sender}`}>
                  <div className="message-history__header">
                    <span className="message-history__sender">{senderLabel(msg.sender)}</span>
                    <span className="message-history__timestamp">{msg.timestamp}</span>
                  </div>
                  <p className="message-history__text">{msg.text}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConversationView;

