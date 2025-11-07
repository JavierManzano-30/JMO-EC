import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { 
  getChatCompletion, 
  getErrorMessage 
} from '../../services/lmstudio';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy BubblyBot, tu asistente virtual. ¡Qué alegría verte por aquí! 💙",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      text: "Estoy aquí para ayudarte con cualquier pregunta o conversación. ¿En qué puedo ayudarte hoy? 🔍",
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

    try {
      // Preparar historial de conversación para el modelo
      const conversationHistory = messages
        .filter(msg => msg.text && (msg.sender === 'user' || msg.sender === 'bot'))
        .slice(-10) // Mantener solo los últimos 10 mensajes para no sobrecargar
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      // Obtener respuesta del modelo
      const botResponseText = await getChatCompletion(messageText, conversationHistory);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al obtener respuesta del modelo:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: getErrorMessage(error),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
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
