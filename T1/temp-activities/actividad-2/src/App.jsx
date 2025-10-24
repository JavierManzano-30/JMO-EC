import React from 'react';
import './App.css';
import pokebotLogo from '/assets/images/pokebot-logo.svg';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="pokemon-logo">
          <img src={pokebotLogo} alt="PokéBot Logo" className="pokebot-logo-img" />
        </div>
        <h1>PokéBot</h1>
        <p>Tu Asistente Pokémon</p>
      </header>

      <main className="main-content">
        <div className="features-info">
          <h2>🎯 ¿Qué puedo hacer?</h2>
          <ul>
            <li>🔍 Buscar información de Pokémon por nombre</li>
            <li>📊 Mostrar estadísticas y habilidades</li>
            <li>🎨 Describir características visuales</li>
            <li>📚 Compartir datos curiosos</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App
