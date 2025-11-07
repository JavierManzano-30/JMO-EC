import React from 'react';

const sampleMessages = [
  { id: 1, sender: 'Tú', message: '¿Puedes ayudarme con un plan de estudio?' },
  { id: 2, sender: 'BubblyBot', message: '¡Claro! Comencemos por organizar tus materias prioritarias.' },
  { id: 3, sender: 'Tú', message: 'Necesito enfocarme en matemáticas y ciencias.' },
  { id: 4, sender: 'BubblyBot', message: 'Perfecto, haré un esquema de repasos y prácticas para cada día.' },
];

const ConversationView = () => {
  return (
    <section className="view-section" aria-labelledby="conversation-view-title">
      <header className="view-header">
        <h2 id="conversation-view-title">Detalle de la conversación</h2>
        <p>Revisa el historial completo y retoma el hilo en el punto exacto donde lo dejaste.</p>
      </header>

      <div className="view-content view-content--conversation">
        <ol className="message-history">
          {sampleMessages.map((msg) => (
            <li key={msg.id} className="message-history__item">
              <span className="message-history__sender">{msg.sender}:</span>
              <span className="message-history__text">{msg.message}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ConversationView;

