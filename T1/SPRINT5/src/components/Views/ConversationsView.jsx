import React from 'react';

const mockConversations = [
  { id: 'conv-1', title: 'Ideas para el proyecto de ciencias', lastMessage: 'Recordemos buscar materiales reciclados.' },
  { id: 'conv-2', title: 'Recetas rápidas', lastMessage: 'Preparar una pasta con verduras salteadas.' },
  { id: 'conv-3', title: 'Entrenamiento semanal', lastMessage: 'Rutina de fuerza lunes, miércoles y viernes.' },
];

const ConversationsView = () => {
  return (
    <section className="view-section" aria-labelledby="conversations-view-title">
      <header className="view-header">
        <h2 id="conversations-view-title">Conversaciones</h2>
        <p>Consulta el historial de conversaciones guardadas para retomarlas más tarde.</p>
      </header>

      <div className="view-content view-content--list">
        <ul className="conversation-list">
          {mockConversations.map((conversation) => (
            <li key={conversation.id} className="conversation-item">
              <h3>{conversation.title}</h3>
              <p>{conversation.lastMessage}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ConversationsView;

