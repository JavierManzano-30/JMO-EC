import React, { useEffect, useRef, useState } from 'react';
import { getPokemonList, getErrorMessage } from '../../services/pokeapi';
import Loading from '../Feedback/Loading';
import ErrorBlock from '../Feedback/ErrorBlock';

const PokedexView = () => {
  const headingRef = useRef(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const loadPokemon = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Cargar algunos Pokémon populares
        const pokemon = await getPokemonList(9, 0);
        setPokemonList(pokemon);
      } catch (err) {
        console.error('Error al cargar Pokémon:', err);
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadPokemon();
  }, []);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pokemon = await getPokemonList(9, 0);
      setPokemonList(pokemon);
    } catch (err) {
      console.error('Error al cargar Pokémon:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="view-section" aria-labelledby="pokedex-view-title">
      <header className="view-header">
        <h2 id="pokedex-view-title" tabIndex={-1} ref={headingRef}>
          Pokédex
        </h2>
        <p>Demostrador de la integración con la POKEAPI implementada en sprints anteriores.</p>
      </header>

      <div className="view-content view-content--grid">
        {isLoading && <Loading message="Cargando Pokémon..." />}
        
        {error && !isLoading && (
          <ErrorBlock
            title="Error al cargar Pokémon"
            message={error}
            onRetry={handleRetry}
            retryLabel="Reintentar"
          />
        )}

        {!isLoading && !error && pokemonList.length === 0 && (
          <div className="pokedex-empty">
            <p>No se encontraron Pokémon para mostrar.</p>
          </div>
        )}

        {!isLoading && !error && pokemonList.map((pokemon) => (
          <article key={pokemon.id} className="pokedex-card" aria-label={`Información de ${pokemon.name}`}>
            {pokemon.sprite && (
              <img 
                src={pokemon.sprite} 
                alt={pokemon.name}
                className="pokedex-card__sprite"
                loading="lazy"
              />
            )}
            <h3>#{pokemon.id} {pokemon.name}</h3>
            <p className="pokedex-card__types">
              Tipo{pokemon.types.length > 1 ? 's' : ''}: {pokemon.types.join(' / ')}
            </p>
            <div className="pokedex-card__details">
              <p>Altura: {pokemon.height}m</p>
              <p>Peso: {pokemon.weight}kg</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PokedexView;

