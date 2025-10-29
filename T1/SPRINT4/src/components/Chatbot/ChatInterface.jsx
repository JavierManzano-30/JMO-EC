import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { 
  getPokemonData, 
  isPokemonQuery, 
  getErrorMessage 
} from '../../services/pokeapi';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy BubblyBot, tu asistente de Pokémon. ¡Qué alegría verte por aquí! 💙",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      text: "Puedo ayudarte a buscar información de cualquier Pokémon. Solo escribe el nombre o número del Pokémon que quieres conocer. ¡Prueba con 'pikachu' o '25'! 🔍",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const generateBotResponse = (userMessage) => {
    const responses = [
      "¡Qué interesante! Me encanta hablar de eso contigo. ¿Podrías contarme más detalles? 🤔",
      "¡Excelente pregunta! Es un tema fascinante. Desde mi perspectiva, creo que... 💭",
      "¡Wow! Nunca había pensado en eso de esa manera. Me parece muy inteligente tu punto de vista. ✨",
      "¡Qué divertido! Me encanta cómo piensas. ¿Has considerado también...? 🎯",
      "¡Increíble! Me fascina aprender cosas nuevas contigo. ¿Qué más sabes sobre esto? 📚",
      "¡Genial! Me encanta conversar contigo. Siempre tienes ideas muy interesantes. 🌟",
      "¡Qué bueno! Me parece un tema súper interesante. ¿Podrías explicarme más? 🔍",
      "¡Fantástico! Me encanta cómo expresas tus ideas. ¿Qué opinas sobre...? 💡"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handlePokemonSearch = async (query) => {
    try {
      console.log('Iniciando búsqueda de Pokémon:', query);
      const pokemonData = await getPokemonData(query);
      
      console.log('Pokémon encontrado:', pokemonData.name);
      
      const pokemonMessage = {
        id: Date.now() + 1,
        text: `¡Aquí tienes la información de ${pokemonData.name}! 🎉`,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
        pokemon: pokemonData
      };
      
      setMessages(prev => [...prev, pokemonMessage]);
    } catch (error) {
      console.log('Error en búsqueda de Pokémon:', error.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: getErrorMessage(error, query),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString()
      };
      
      console.log('Mensaje de error creado:', errorMessage.text);
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = async (messageText) => {
    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    // Siempre tratar como búsqueda de Pokémon
    setTimeout(() => {
      handlePokemonSearch(messageText);
      setIsThinking(false);
    }, 1000 + Math.random() * 1000); // Entre 1 y 2 segundos
  };

  return (
    <div className="chat-interface">
      <MessageList messages={messages} isThinking={isThinking} />
      <div ref={messagesEndRef} />
      <MessageInput onSendMessage={handleSendMessage} disabled={isThinking} />
    </div>
  );
};

export default ChatInterface;
