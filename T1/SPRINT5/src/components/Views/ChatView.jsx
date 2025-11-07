import React from 'react';
import ChatWindow from '../Chatbot/ChatWindow';

const ChatView = () => {
  return (
    <section className="view-section" aria-labelledby="chat-view-title">
      <header className="view-header">
        <h2 id="chat-view-title">Inicio / Chat</h2>
        <p>Habla con BubblyBot en la vista principal del asistente.</p>
      </header>

      <div className="view-content">
        <ChatWindow />
      </div>
    </section>
  );
};

export default ChatView;

