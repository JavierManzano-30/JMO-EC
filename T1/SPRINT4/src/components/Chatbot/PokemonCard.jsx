import React from 'react';

const PokemonCard = ({ pokemon }) => {
  if (!pokemon) return null;

  const { name, id, sprite, types, height, weight, abilities, stats } = pokemon;

  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <div className="pokemon-image">
          {sprite && (
            <img 
              src={sprite} 
              alt={name}
              className="pokemon-sprite"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        <div className="pokemon-info">
          <h3 className="pokemon-name">{name}</h3>
          <p className="pokemon-number">#{id.toString().padStart(3, '0')}</p>
          <div className="pokemon-types">
            {types.map((type, index) => (
              <span key={index} className={`type-badge type-${type.toLowerCase()}`}>
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pokemon-details">
        <div className="detail-row">
          <span className="detail-label">Altura:</span>
          <span className="detail-value">{height}m</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Peso:</span>
          <span className="detail-value">{weight}kg</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Habilidades:</span>
          <span className="detail-value">{abilities.slice(0, 2).join(', ')}</span>
        </div>
      </div>
      
      <div className="pokemon-stats">
        <h4>Estadísticas Base</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-name">HP</span>
            <span className="stat-value">{stats.hp}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">Ataque</span>
            <span className="stat-value">{stats.attack}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">Defensa</span>
            <span className="stat-value">{stats.defense}</span>
          </div>
          <div className="stat-item">
            <span className="stat-name">Velocidad</span>
            <span className="stat-value">{stats.speed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
