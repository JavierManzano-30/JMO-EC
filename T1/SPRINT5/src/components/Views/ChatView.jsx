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
      <div className="view-content">
        <ChatWindow
          conversationId={conversationId}
          onConversationCreated={handleConversationCreated}
          title="Inicio / Chat"
          subtitle="Habla con BubblyBot en la vista principal del asistente."
          onNewConversation={handleNewConversation}
        />
      </div>
    </section>
  );
};

export default ChatView;
