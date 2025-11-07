import React, { useEffect, useRef } from 'react';

const demoPokemon = [
  { id: 25, name: 'Pikachu', type: 'Eléctrico' },
  { id: 1, name: 'Bulbasaur', type: 'Planta / Veneno' },
  { id: 7, name: 'Squirtle', type: 'Agua' },
];

const PokedexView = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section className="view-section" aria-labelledby="pokedex-view-title">
      <header className="view-header">
        <h2 id="pokedex-view-title" tabIndex={-1} ref={headingRef}>
          Pokédex
        </h2>
        <p>Demostrador de la integración con la POKEAPI implementada en sprints anteriores.</p>
      </header>

      <div className="view-content view-content--grid">
        {demoPokemon.map((pokemon) => (
          <article key={pokemon.id} className="pokedex-card" aria-label={`Información de ${pokemon.name}`}>
            <h3>#{pokemon.id} {pokemon.name}</h3>
            <p>Tipo: {pokemon.type}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PokedexView;

