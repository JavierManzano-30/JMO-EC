import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { 
  getChatCompletion, 
  getErrorMessage 
} from '../../services/lmstudio';
import {
  createConversation,
  addMessageToConversation,
  getConversationById,
} from '../../services/conversations';

const initialMessages = [
  {
    id: 1,
    text: "¡Hola! Soy BubblyBot, tu asistente virtual. ¿En qué puedo ayudarte hoy? 💙",
    sender: "bot",
    timestamp: new Date().toLocaleTimeString()
  }
];

const ChatInterface = ({ conversationId: externalConversationId = null, onConversationCreated = null }) => {
  const [messages, setMessages] = useState(initialMessages);
  
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState(externalConversationId);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const adaptHistoryMessages = (history = []) =>
    history.map((msg) => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender === 'user' ? 'user' : 'bot',
      timestamp:
        msg.timestamp ||
        (msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString()),
    }));

  // Cargar historial cuando cambia el ID externo
  useEffect(() => {
    let ignore = false;

    const loadHistory = async () => {
      if (!externalConversationId) {
        setMessages([...initialMessages]);
        setCurrentConversationId(null);
        setHistoryError('');
        return;
      }

      setIsLoadingHistory(true);
      setHistoryError('');

      try {
        const conversation = await getConversationById(externalConversationId);
        if (ignore) {
          return;
        }

        if (conversation && conversation.messages && conversation.messages.length > 0) {
          setMessages(adaptHistoryMessages(conversation.messages));
        } else {
          setMessages([...initialMessages]);
        }
        setCurrentConversationId(externalConversationId);
      } catch (error) {
        if (!ignore) {
          console.error('Error al cargar conversación previa en el chat:', error);
          setHistoryError('No se pudo cargar la conversación previa. Puedes continuar escribiendo.');
          setMessages([...initialMessages]);
          setCurrentConversationId(null);
        }
      } finally {
        if (!ignore) {
          setIsLoadingHistory(false);
        }
      }
    };

    loadHistory();
    return () => {
      ignore = true;
    };
  }, [externalConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    if (!isThinking) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isThinking]);

  // NO crear conversación automáticamente - solo cuando el usuario envíe un mensaje
  // Esto evita crear conversaciones vacías en la base de datos

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSendMessage = async (messageText) => {
    // Crear conversación si no existe (solo cuando el usuario envía el primer mensaje)
    let conversationIdToUse = currentConversationId;
    
    if (!conversationIdToUse) {
      try {
        // Crear conversación con los mensajes iniciales (incluyendo el del bot)
        const initialMessagesToSave = messages.map(msg => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
        }));
        
        const newConversation = await createConversation(initialMessagesToSave);
        conversationIdToUse = newConversation.id;
        setCurrentConversationId(conversationIdToUse);
        if (onConversationCreated) {
          onConversationCreated(newConversation.id);
        }
      } catch (error) {
        console.error('Error al crear la conversación:', error);
        // Continuar aunque falle la creación, para no bloquear el chat
      }
    }

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsThinking(true);

    // Guardar mensaje del usuario en la conversación
    if (conversationIdToUse) {
      try {
        await addMessageToConversation(conversationIdToUse, userMessage);
      } catch (error) {
        console.error('Error al guardar mensaje del usuario:', error);
      }
    }

    try {
      // Preparar historial de conversación para el modelo
      const conversationHistory = updatedMessages
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
      
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Guardar mensaje del bot en la conversación
      if (conversationIdToUse) {
        try {
          await addMessageToConversation(conversationIdToUse, botMessage);
        } catch (error) {
          console.error('Error al guardar mensaje del bot:', error);
        }
      }
    } catch (error) {
      console.error('Error al obtener respuesta del modelo:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: getErrorMessage(error),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);

      // Guardar mensaje de error en la conversación
      if (conversationIdToUse) {
        try {
          await addMessageToConversation(conversationIdToUse, errorMessage);
        } catch (error) {
          console.error('Error al guardar mensaje de error:', error);
        }
      }
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="chat-interface">
      {isLoadingHistory && (
        <div className="chat-info" role="status">
          Cargando conversación guardada...
        </div>
      )}
      {historyError && (
        <div className="chat-warning" role="alert">
          {historyError}
        </div>
      )}
      <MessageList messages={messages} isThinking={isThinking} />
      <div ref={messagesEndRef} />
      <MessageInput onSendMessage={handleSendMessage} disabled={isThinking} ref={inputRef} />
    </div>
  );
};

export default ChatInterface;
