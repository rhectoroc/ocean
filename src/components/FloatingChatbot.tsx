import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
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
            console.log('Sending message to webhook:', WEBHOOK_URL);
            console.log('Payload:', { message: text.trim(), sessionId: sessionId.current });

            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text.trim(),
                    chatInput: text.trim(),
                    sessionId: sessionId.current
                })
            });

            const data = await response.json();
            console.log('Response status:', response.status);
            console.log('Response data:', data);

            if (!response.ok) {
                console.error('Webhook error details:', data);
                throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
            }

            // Add bot response
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || data.message || data.output || 'Lo siento, no pude procesar tu mensaje.',
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);

            let errorText = 'Lo siento, hubo un error al conectar con el servidor.';

            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorText = 'No se pudo conectar al servidor. Verifica tu conexión a internet o que el webhook esté activo.';
            } else if (error instanceof Error) {
                errorText = `Error: ${error.message}`;
            }

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: errorText,
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

    return (
        <div className="chatbot-container">
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    data-chatbot-button
                    className="chatbot-button"
                    aria-label="Open chat"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-modal">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="flex items-center gap-3">
                            <div className="chatbot-avatar">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Pushi</h3>
                                <p className="text-xs text-ocean-100">Ocean Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-ocean-700 p-1 rounded transition-colors"
                            aria-label="Close chat"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`chatbot-message ${message.sender === 'user' ? 'chatbot-message-user' : 'chatbot-message-bot'}`}
                            >
                                <div className="chatbot-message-content">
                                    {message.text}
                                </div>
                                <span className="chatbot-message-time">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
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

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="chatbot-input-container">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border-0 focus:outline-none bg-transparent"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="chatbot-send-button"
                            aria-label="Send message"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FloatingChatbot;
