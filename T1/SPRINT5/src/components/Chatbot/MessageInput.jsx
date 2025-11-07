import React, { forwardRef, useState } from 'react';

const MessageInput = forwardRef(({ onSendMessage, disabled }, textareaRef) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="message-text-input"
            disabled={disabled}
            rows="1"
          ref={textareaRef}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={disabled || !message.trim()}
          >
            <span className="send-icon">📤</span>
          </button>
        </div>
      </form>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;
