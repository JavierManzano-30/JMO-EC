import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  getConversationById, 
  deleteConversation, 
  duplicateConversation 
} from '../../services/conversations';
import { readSearchParams } from '../../services/urlState';
import Loading from '../Feedback/Loading';
import ErrorBlock from '../Feedback/ErrorBlock';

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
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
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

  // Cargar conversación cuando cambia el ID
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) {
        setConversation(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const loaded = await getConversationById(conversationId);
        if (!loaded) {
          setError('Conversación no encontrada');
          setConversation(null);
        } else {
          setConversation(loaded);
          setError(null);
        }
      } catch (err) {
        console.error('Error al cargar la conversación:', err);
        setError('No se pudo cargar la conversación. Por favor, intenta de nuevo.');
        setConversation(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [conversationId]);

  const handleGoToList = () => {
    navigate?.('conversations');
  };

  const handleDelete = async () => {
    if (!conversationId || !conversation) {
      return;
    }

    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${conversation.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteConversation(conversationId);
      // Navegar al listado después de eliminar
      navigate?.('conversations');
    } catch (err) {
      console.error('Error al eliminar la conversación:', err);
      setError('No se pudo eliminar la conversación. Por favor, intenta de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    if (!conversationId || !conversation) {
      return;
    }

    setIsDuplicating(true);
    try {
      const duplicated = await duplicateConversation(conversationId);
      // Navegar a la conversación duplicada
      navigate?.('conversation', {
        params: { id: duplicated.id },
      });
    } catch (err) {
      console.error('Error al duplicar la conversación:', err);
      setError('No se pudo duplicar la conversación. Por favor, intenta de nuevo.');
    } finally {
      setIsDuplicating(false);
    }
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

        {isLoading && conversationId && (
          <Loading message="Cargando conversación..." />
        )}

        {error && conversationId && !isLoading && (
          <ErrorBlock
            title="Error"
            message={error}
            onRetry={() => {
              setError(null);
              // Recargar la conversación
              const params = readSearchParams();
              const urlId = params.get('id');
              setConversationId(urlId);
            }}
            retryLabel="Reintentar"
          />
        )}

        {conversationId && !conversation && !isLoading && !error && (
          <div className="conversation-placeholder">
            <p>No se encontró una conversación con el identificador proporcionado.</p>
            <button type="button" className="primary-button" onClick={handleGoToList}>
              Volver al listado
            </button>
          </div>
        )}

        {conversation && !isLoading && (
          <div className="conversation-detail">
            <div className="conversation-detail__meta">
              <div className="conversation-detail__header">
                <div>
                  <h3>{conversation.title}</h3>
                  <p>{conversation.summary}</p>
                  <span className="conversation-detail__timestamp">
                    Última actualización: {formatDateTime(conversation.updatedAt)}
                  </span>
                </div>
                <div className="conversation-detail__actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleDuplicate}
                    disabled={isDuplicating || isDeleting}
                    title="Duplicar esta conversación"
                  >
                    {isDuplicating ? 'Duplicando...' : 'Duplicar'}
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={handleDelete}
                    disabled={isDeleting || isDuplicating}
                    title="Eliminar esta conversación"
                  >
                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>

            <ol className="message-history">
              {conversation.messages && conversation.messages.length > 0 ? (
                conversation.messages.map((msg) => (
                  <li key={msg.id} className={`message-history__item message-history__item--${msg.sender}`}>
                    <div className="message-history__header">
                      <span className="message-history__sender">{senderLabel(msg.sender)}</span>
                      <span className="message-history__timestamp">{msg.timestamp}</span>
                    </div>
                    <p className="message-history__text">{msg.text}</p>
                  </li>
                ))
              ) : (
                <li className="message-history__item message-history__item--empty">
                  <p>Esta conversación no tiene mensajes aún.</p>
                </li>
              )}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConversationView;

