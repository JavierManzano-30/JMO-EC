import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy BubblyBot, tu compañero de charla. ¡Qué alegría verte por aquí! 💙",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      text: "¡Hablemos de lo que sea! Estoy aquí para conversar contigo sobre cualquier tema. ¡Eres muy bienvenido! 😄",
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

    // Simular tiempo de respuesta del bot
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(messageText),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsThinking(false);
    }, 1500 + Math.random() * 1000); // Entre 1.5 y 2.5 segundos
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
