import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ChatWindow from '../Chatbot/ChatWindow';
import {
  getActiveConversationId,
  setActiveConversationId,
  clearActiveConversationId,
} from '../../services/activeConversation';

const ChatView = ({ session }) => {
  const userId = session?.user?.id ?? null;
  const initialConversationId = useMemo(() => {
    if (!userId) {
      return null;
    }
    return getActiveConversationId(userId);
  }, [userId]);

  const [conversationId, setConversationId] = useState(initialConversationId);

  useEffect(() => {
    if (!userId) {
      setConversationId(null);
      return;
    }

    setConversationId(getActiveConversationId(userId));
  }, [userId]);

  const persistConversation = useCallback(
    (id) => {
      if (!userId) {
        return;
      }

      if (id) {
        setActiveConversationId(userId, id);
      } else {
        clearActiveConversationId(userId);
      }
    },
    [userId],
  );

  const handleNewConversation = useCallback(async () => {
    setConversationId(null);
    persistConversation(null);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }, [persistConversation]);

  const handleConversationCreated = useCallback(
    (id) => {
      setConversationId(id);
      persistConversation(id);
    },
    [persistConversation],
  );

  return (
    <section className="view-section" aria-labelledby="chat-view-title">
      <header className="view-header">
        <div className="view-header__content">
          <div>
            <h2 id="chat-view-title">Inicio / Chat</h2>
            <p>Habla con BubblyBot en la vista principal del asistente.</p>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={handleNewConversation}
            title="Iniciar una nueva conversación"
          >
            Nueva conversación
          </button>
        </div>
      </header>

      <div className="view-content">
        <ChatWindow
          conversationId={conversationId}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </section>
  );
};

export default ChatView;
