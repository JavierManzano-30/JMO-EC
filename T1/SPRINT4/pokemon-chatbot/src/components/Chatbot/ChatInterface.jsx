import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { searchPokemon } from '../../services/pokeapi';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy BubblyBot, tu asistente de Pokémon. ¿Qué Pokémon te gustaría conocer? Puedes escribir su nombre o número.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const pokemonData = await searchPokemon(messageText.trim());
      
      if (pokemonData) {
        const botMessage = {
          id: Date.now() + 1,
          text: `¡Encontré información sobre ${pokemonData.name}!`,
          isUser: false,
          timestamp: new Date(),
          pokemonData: pokemonData
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          text: "No pude encontrar ese Pokémon. ¿Podrías verificar el nombre o número? Intenta con otro Pokémon.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "¡Ups! Hubo un problema al buscar el Pokémon. Inténtalo de nuevo.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;
