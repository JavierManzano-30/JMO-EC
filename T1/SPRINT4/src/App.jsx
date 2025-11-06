import React from 'react';
import './styles/layout.css';
import './App.css';
import bubblybotLogo from './assets/images/bubblybot-logo.svg';
import ChatWindow from './components/Chatbot/ChatWindow';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="bubbly-logo">
            <img src={bubblybotLogo} alt="BubblyBot Logo" className="bubblybot-logo-img" />
          </div>
          <div className="header-text">
            <h1>BubblyBot</h1>
            <p>Tu Compañero de Charla</p>
          </div>
        </div>
      </header>

      <main className="main-layout">
        <aside className="info-panel">
          <div className="panel-section">
            <h3>🎯 ¿Qué puedo hacer?</h3>
            <ul>
              <li>💬 Mantener conversaciones naturales</li>
              <li>📚 Responder preguntas</li>
              <li>🧠 Recordar el contexto de la conversación</li>
              <li>🎨 Ayudarte con cualquier tema</li>
            </ul>
          </div>

          <div className="panel-section">
            <h3>🌟 Características</h3>
            <div className="feature-grid">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <span>Modelo local (LM Studio)</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💭</span>
                <span>Contexto de conversación</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Respuesta rápida</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Privacidad local</span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h3>💡 Consejos de uso</h3>
            <div className="tips">
              <p>• Haz cualquier pregunta o comenta cualquier tema</p>
              <p>• El chatbot recuerda el contexto de la conversación</p>
              <p>• Asegúrate de tener LM Studio ejecutándose</p>
              <p>• El servidor debe estar activo en el puerto 1234</p>
            </div>
          </div>

          <div className="panel-section">
            <h3>📊 Estado del sistema</h3>
            <div className="status-info">
              <div className="status-item">
                <span className="status-dot online"></span>
                <span>BubblyBot: En línea</span>
              </div>
              <div className="status-item">
                <span className="status-dot ready"></span>
                <span>Sistema: Listo</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="chat-section">
          <ChatWindow />
        </section>
      </main>
    </div>
  );
}

export default App
