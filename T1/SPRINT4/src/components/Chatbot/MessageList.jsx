import React, { useState, useEffect } from 'react';

const MessageList = ({ messages, isThinking }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.sender}`}>
          <div className="message-content">
            <div className="message-header">
              <span className="sender-name">
                {message.sender === 'user' ? 'Tú' : 'BubblyBot'}
              </span>
              <span className="timestamp">{message.timestamp}</span>
            </div>
            <p className="message-text">{message.text}</p>
          </div>
        </div>
      ))}
      
      {isThinking && (
        <div className="message bot">
          <div className="message-content">
            <div className="message-header">
              <span className="sender-name">BubblyBot</span>
              <span className="timestamp">Ahora</span>
            </div>
            <div className="thinking-indicator">
              <span className="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span className="thinking-text">Pensando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
