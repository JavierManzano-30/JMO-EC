// Servicio para interactuar con la POKEAPI
// https://pokeapi.co/

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Obtiene información de un Pokémon por nombre o número
 * @param {string|number} query - Nombre del Pokémon o número de la Pokédex
 * @returns {Promise<Object>} Datos del Pokémon o error
 */
export const getPokemonData = async (query) => {
  try {
    // Limpiar y normalizar la consulta
    const cleanQuery = String(query).toLowerCase().trim();
    
    // Construir URL de la API
    const url = `${POKEAPI_BASE_URL}/pokemon/${cleanQuery}`;
    
    console.log('Buscando Pokémon:', cleanQuery, 'URL:', url);
    
    // Realizar petición a la API
    const response = await fetch(url);
    
    console.log('Respuesta de la API:', response.status, response.ok);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Pokémon no encontrado:', cleanQuery);
        throw new Error('POKEMON_NOT_FOUND');
      }
      console.log('Error de API:', response.status);
      throw new Error('API_ERROR');
    }
    
    const data = await response.json();
    console.log('Datos recibidos:', data.name, data.id);
    
    // Formatear datos del Pokémon
    return formatPokemonData(data);
    
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    // Si es un error de red, lo convertimos a API_ERROR
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      throw new Error('API_ERROR');
    }
    throw error;
  }
};

/**
 * Formatea los datos del Pokémon para el chatbot
 * @param {Object} rawData - Datos brutos de la API
 * @returns {Object} Datos formateados
 */
const formatPokemonData = (rawData) => {
  return {
    id: rawData.id,
    name: capitalizeFirst(rawData.name),
    sprite: rawData.sprites.front_default || rawData.sprites.other['official-artwork']?.front_default,
    types: rawData.types.map(type => capitalizeFirst(type.type.name)),
    height: rawData.height / 10, // Convertir de decímetros a metros
    weight: rawData.weight / 10, // Convertir de hectogramos a kg
    abilities: rawData.abilities.map(ability => capitalizeFirst(ability.ability.name)),
    baseExperience: rawData.base_experience,
    stats: {
      hp: rawData.stats[0].base_stat,
      attack: rawData.stats[1].base_stat,
      defense: rawData.stats[2].base_stat,
      specialAttack: rawData.stats[3].base_stat,
      specialDefense: rawData.stats[4].base_stat,
      speed: rawData.stats[5].base_stat
    }
  };
};

/**
 * Capitaliza la primera letra de una palabra
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Valida si una consulta parece ser un número de Pokédex
 * @param {string} query - Consulta del usuario
 * @returns {boolean} True si parece ser un número
 */
export const isPokemonNumber = (query) => {
  const cleanQuery = String(query).trim();
  return /^\d+$/.test(cleanQuery) && parseInt(cleanQuery) > 0 && parseInt(cleanQuery) <= 1010;
};

/**
 * Valida si una consulta parece ser un nombre de Pokémon
 * @param {string} query - Consulta del usuario
 * @returns {boolean} True si parece ser un nombre
 */
export const isPokemonName = (query) => {
  const cleanQuery = String(query).trim().toLowerCase();
  return /^[a-z]+$/.test(cleanQuery) && cleanQuery.length >= 2;
};

/**
 * Detecta si una consulta es una búsqueda de Pokémon
 * @param {string} query - Consulta del usuario
 * @returns {boolean} True si parece ser una búsqueda de Pokémon
 */
export const isPokemonQuery = (query) => {
  return isPokemonNumber(query) || isPokemonName(query);
};

/**
 * Genera un mensaje de error personalizado
 * @param {Error} error - Error capturado
 * @param {string} query - Consulta original del usuario
 * @returns {string} Mensaje de error amigable
 */
export const getErrorMessage = (error, query) => {
  console.log('Generando mensaje de error:', error.message, 'para consulta:', query);
  
  switch (error.message) {
    case 'POKEMON_NOT_FOUND':
      return `❌ No encuentro ningún Pokémon llamado "${query}". ¿Podrías verificar el nombre o número? Puedes probar con "pikachu" o "25".`;
    case 'API_ERROR':
      return `⚠️ Hubo un problema al consultar la Pokédex. Inténtalo de nuevo en un momento.`;
    default:
      return `❌ Oops, algo salió mal al buscar "${query}". Inténtalo de nuevo.`;
  }
};