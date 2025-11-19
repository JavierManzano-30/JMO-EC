import React from 'react';

const PokemonCard = ({ pokemonData }) => {
  if (!pokemonData) return null;

  const { name, id, sprites, types, stats, height, weight, abilities } = pokemonData;

  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <div className="pokemon-image">
          <img 
            src={sprites?.other?.['official-artwork']?.front_default || sprites?.front_default} 
            alt={name}
            className="pokemon-img"
          />
        </div>
        <div className="pokemon-info">
          <h3 className="pokemon-name">{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
          <p className="pokemon-id">#{id}</p>
        </div>
      </div>

      <div className="pokemon-details">
        <div className="pokemon-types">
          <h4>Tipos:</h4>
          <div className="types-container">
            {types?.map((type, index) => (
              <span key={index} className={`type-badge type-${type.type.name}`}>
                {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
              </span>
            ))}
          </div>
        </div>

        <div className="pokemon-stats">
          <h4>Estadísticas:</h4>
          <div className="stats-grid">
            {stats?.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-name">{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}:</span>
                <span className="stat-value">{stat.base_stat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pokemon-physical">
          <div className="physical-info">
            <span><strong>Altura:</strong> {height / 10}m</span>
            <span><strong>Peso:</strong> {weight / 10}kg</span>
          </div>
        </div>

        {abilities && abilities.length > 0 && (
          <div className="pokemon-abilities">
            <h4>Habilidades:</h4>
            <div className="abilities-list">
              {abilities.map((ability, index) => (
                <span key={index} className="ability-item">
                  {ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
