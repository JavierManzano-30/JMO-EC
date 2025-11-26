import React from 'react';
import ChatInterface from './ChatInterface';
import '../chatbot.css';

const ChatWindow = ({
  conversationId = null,
  onConversationCreated = null,
  title,
  subtitle,
  onNewConversation,
  newConversationLabel = 'Nueva conversación',
}) => {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header__left">
          <div className="chatbot-avatar">
            <div className="bubble-avatar"></div>
          </div>
          <div className="chat-header__text">
            {title && (
              <h2 className="chat-header__title" id="chat-view-title">
                {title}
              </h2>
            )}
            {subtitle && <p className="chat-header__subtitle">{subtitle}</p>}
            <div className="chatbot-info">
              <h3>BubblyBot</h3>
              <span className="status-indicator">¡Listo para charlar!</span>
            </div>
          </div>
        </div>

        {onNewConversation && (
          <button
            type="button"
            className="primary-button chat-header__action"
            onClick={onNewConversation}
            title="Iniciar una nueva conversación"
          >
            {newConversationLabel}
          </button>
        )}
      </div>

      <ChatInterface
        conversationId={conversationId}
        onConversationCreated={onConversationCreated}
      />
    </div>
  );
};

export default ChatWindow;
