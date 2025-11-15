import React from 'react';
import ChatInterface from './ChatInterface';
import '../chatbot.css';

const ChatWindow = ({ conversationId = null, onConversationCreated = null }) => {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chatbot-avatar">
          <div className="bubble-avatar"></div>
        </div>
        <div className="chatbot-info">
          <h3>BubblyBot</h3>
          <span className="status-indicator">¡Listo para charlar!</span>
        </div>
      </div>
      
      <ChatInterface 
        conversationId={conversationId}
        onConversationCreated={onConversationCreated}
      />
    </div>
  );
};

export default ChatWindow;
