import React from 'react';
import './styles/layout.css';
import './App.css';
import bubblybotLogo from '/assets/images/bubblybot-logo.svg';
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
              <li>🔍 Buscar información de Pokémon</li>
              <li>📊 Mostrar estadísticas y tipos</li>
              <li>🖼️ Mostrar imágenes oficiales</li>
              <li>📚 Compartir datos de la Pokédex</li>
            </ul>
          </div>

          <div className="panel-section">
            <h3>🌟 Características</h3>
            <div className="feature-grid">
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <span>Búsqueda por nombre</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔢</span>
                <span>Búsqueda por número</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Estadísticas completas</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Respuesta rápida</span>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <h3>💡 Consejos de uso</h3>
            <div className="tips">
              <p>• Escribe el nombre del Pokémon (ej: pikachu)</p>
              <p>• O escribe su número (ej: 25)</p>
              <p>• ¡Prueba con diferentes Pokémon!</p>
              <p>• Puedes buscar cualquier Pokémon de la Pokédex</p>
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
          <div className="section-title">
            <h2>¡Busca información de Pokémon!</h2>
            <p>Escribe el nombre o número del Pokémon que quieres conocer. ¡BubblyBot te ayudará a encontrar toda la información!</p>
          </div>
          
          <ChatWindow />
        </section>
      </main>
    </div>
  );
}

export default App
