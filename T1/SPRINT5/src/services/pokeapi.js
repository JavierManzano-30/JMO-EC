/**
 * Servicio para interactuar con la POKEAPI
 * https://pokeapi.co/
 */

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Obtiene información de un Pokémon por su ID o nombre
 * @param {string|number} identifier - ID numérico o nombre del Pokémon
 * @returns {Promise<Object>} Datos del Pokémon
 */
export const getPokemon = async (identifier) => {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${identifier.toLowerCase()}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NOT_FOUND');
      }
      throw new Error('API_ERROR');
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      types: data.types.map((type) => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)),
      sprite: data.sprites.front_default,
      height: data.height / 10, // Convertir a metros
      weight: data.weight / 10, // Convertir a kilogramos
      abilities: data.abilities.map((ability) => 
        ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1).replace('-', ' ')
      ),
    };
  } catch (error) {
    if (error.message === 'NOT_FOUND' || error.message === 'API_ERROR') {
      throw error;
    }
    console.error('Error fetching Pokemon:', error);
    throw new Error('API_ERROR');
  }
};

/**
 * Obtiene una lista de Pokémon (limitada)
 * @param {number} limit - Número máximo de Pokémon a obtener
 * @param {number} offset - Offset para paginación
 * @returns {Promise<Array>} Lista de Pokémon
 */
export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error('API_ERROR');
    }
    
    const data = await response.json();
    
    // Obtener detalles de cada Pokémon
    const pokemonPromises = data.results.slice(0, limit).map(async (pokemon) => {
      try {
        return await getPokemon(pokemon.name);
      } catch (error) {
        console.warn(`Error al obtener detalles de ${pokemon.name}:`, error);
        return null;
      }
    });
    
    const pokemonList = await Promise.all(pokemonPromises);
    return pokemonList.filter((pokemon) => pokemon !== null);
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw new Error('API_ERROR');
  }
};

/**
 * Genera un mensaje de error personalizado
 * @param {Error} error - Error capturado
 * @returns {string} Mensaje de error amigable
 */
export const getErrorMessage = (error) => {
  switch (error.message) {
    case 'NOT_FOUND':
      return 'Pokémon no encontrado. Verifica el nombre o ID e intenta de nuevo.';
    case 'API_ERROR':
      return 'Error al conectar con la POKEAPI. Por favor, verifica tu conexión a internet e intenta de nuevo.';
    default:
      return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
};

