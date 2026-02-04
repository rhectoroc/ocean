import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import './FloatingChatbot.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '¡Hola! Soy Pushi, tu asistente virtual de Ocean. ¿En qué puedo ayudarte hoy?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sessionId = useRef(generateSessionId());

    const WEBHOOK_URL = 'https://ocean-n8n.1m85g5.easypanel.host/webhook/ebbaff41-f04a-4207-8b4b-17789300b26b/chat';

    function generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text.trim(),
                    sessionId: sessionId.current
                })
            });

            const data = await response.json();

            // Add bot response
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || data.message || 'Lo siento, no pude procesar tu mensaje.',
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Lo siento, hubo un error al conectar con el servidor. Por favor intenta de nuevo.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                className={`chatbot-button ${isOpen ? 'chatbot-button-hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="Abrir chat con Pushi"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="chatbot-avatar-video"
                >
                    <source src="/Avatar.mp4" type="video/mp4" />
                </video>
                <div className="chatbot-pulse"></div>
            </button>

            {/* Chat Modal */}
            {isOpen && (
                <div className="chatbot-modal">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar-small">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="chatbot-avatar-video-small"
                                >
                                    <source src="/Avatar.mp4" type="video/mp4" />
                                </video>
                            </div>
                            <div>
                                <h3 className="chatbot-title">Pushi</h3>
                                <p className="chatbot-subtitle">Asistente Virtual</p>
                            </div>
                        </div>
                        <button
                            className="chatbot-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Cerrar chat"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`chatbot-message ${message.sender === 'user' ? 'chatbot-message-user' : 'chatbot-message-bot'}`}
                            >
                                <div className="chatbot-message-content">
                                    {message.text}
                                </div>
                                <div className="chatbot-message-time">
                                    {message.timestamp.toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="chatbot-message-content">
                                    <div className="chatbot-typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input-container" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="chatbot-input"
                            placeholder="Escribe tu mensaje..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="chatbot-send"
                            disabled={!inputValue.trim() || isLoading}
                            aria-label="Enviar mensaje"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default FloatingChatbot;
