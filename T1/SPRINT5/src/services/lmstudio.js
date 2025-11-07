// Servicio para interactuar con la API de LM Studio
// Usa el proxy de Vite para evitar problemas de CORS
// El proxy redirige /api/lmstudio/* hacia http://127.0.0.1:1234/*

const LM_STUDIO_BASE_URL = '/api/lmstudio';

// Cache para el nombre del modelo
let cachedModelName = null;

/**
 * Obtiene los modelos disponibles en LM Studio
 * @returns {Promise<Object>} Lista de modelos disponibles
 */
export const getModels = async () => {
  try {
    const response = await fetch(`${LM_STUDIO_BASE_URL}/v1/models`);
    
    if (!response.ok) {
      throw new Error('API_ERROR');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    throw new Error('API_ERROR');
  }
};

/**
 * Obtiene el nombre del modelo a utilizar (usa cache si está disponible)
 * @returns {Promise<string>} Nombre del modelo
 */
const getModelName = async () => {
  if (cachedModelName) {
    return cachedModelName;
  }

  try {
    const modelsData = await getModels();
    
    // Intentar obtener el primer modelo disponible
    if (modelsData.data && modelsData.data.length > 0) {
      cachedModelName = modelsData.data[0].id;
      return cachedModelName;
    }
    
    // Fallback si no hay modelos en el formato esperado
    cachedModelName = 'local-model';
    return cachedModelName;
  } catch (error) {
    // Si falla, usar el nombre por defecto
    console.warn('No se pudo obtener el modelo, usando "local-model" por defecto:', error);
    cachedModelName = 'local-model';
    return cachedModelName;
  }
};

/**
 * Obtiene una respuesta del chatbot usando chat completions
 * @param {string} message - Mensaje del usuario
 * @param {Array} conversationHistory - Historial de conversación
 * @returns {Promise<string>} Respuesta del chatbot
 */
export const getChatCompletion = async (message, conversationHistory = []) => {
  try {
    // Obtener el nombre del modelo
    const modelName = await getModelName();
    
    // Preparar los mensajes para la API
    const messages = [
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(`${LM_STUDIO_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('API_ERROR');
    }

    const data = await response.json();
    
    // Extraer la respuesta del modelo
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    
    throw new Error('INVALID_RESPONSE');
  } catch (error) {
    console.error('Error getting chat completion:', error);
    throw error;
  }
};

/**
 * Obtiene una respuesta usando el endpoint de completions
 * @param {string} prompt - Prompt del usuario
 * @returns {Promise<string>} Respuesta del modelo
 */
export const getCompletion = async (prompt) => {
  try {
    // Obtener el nombre del modelo
    const modelName = await getModelName();
    
    const response = await fetch(`${LM_STUDIO_BASE_URL}/v1/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('API_ERROR');
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].text;
    }
    
    throw new Error('INVALID_RESPONSE');
  } catch (error) {
    console.error('Error getting completion:', error);
    throw error;
  }
};

/**
 * Genera un mensaje de error personalizado
 * @param {Error} error - Error capturado
 * @returns {string} Mensaje de error amigable
 */
export const getErrorMessage = (error) => {
  switch (error.message) {
    case 'API_ERROR':
      return '⚠️ Hubo un problema al conectar con el modelo. Por favor, asegúrate de que LM Studio esté ejecutándose y que el servidor esté activo en el puerto 1234.';
    case 'INVALID_RESPONSE':
      return '❌ El modelo no pudo generar una respuesta válida. Inténtalo de nuevo.';
    default:
      return '❌ Oops, algo salió mal. Inténtalo de nuevo.';
  }
};
