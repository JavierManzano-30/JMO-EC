import React from 'react';
import ChatInterface from './ChatInterface';
import '../chatbot.css';

const ChatWindow = () => {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chatbot-avatar">
          <div className="bubble-avatar"></div>
        </div>
        <div className="chatbot-info">
          <h3>BubblyBot</h3>
          <span className="status-indicator">Asistente de Pokémon</span>
        </div>
      </div>
      
      <ChatInterface />
    </div>
  );
};

export default ChatWindow;
