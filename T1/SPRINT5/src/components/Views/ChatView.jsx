import React, { useState, useCallback } from 'react';
import ChatWindow from '../Chatbot/ChatWindow';
import { createConversation } from '../../services/conversations';

const ChatView = ({ navigate }) => {
  const [conversationId, setConversationId] = useState(null);

  const handleNewConversation = useCallback(async () => {
    try {
      // Resetear primero para que el chat se limpie
      setConversationId(null);
      // Pequeño delay para asegurar que el reset se procese
      await new Promise(resolve => setTimeout(resolve, 100));
      // Crear nueva conversación vacía
      const newConversation = await createConversation([]);
      setConversationId(newConversation.id);
    } catch (error) {
      console.error('Error al crear nueva conversación:', error);
    }
  }, []);

  const handleConversationCreated = useCallback((id) => {
    setConversationId(id);
  }, []);

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

