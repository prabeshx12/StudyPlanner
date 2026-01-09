import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2, Trash2 } from 'lucide-react';

const Chat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Study Assistant. Upload your notes and ask me anything!", sender: 'bot' }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const resp = await axios.post('http://localhost:8000/chat/', { question: input });
            const botMessage = {
                id: Date.now() + 1,
                text: resp.data.answer,
                sender: 'bot',
                sources: resp.data.sources
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I encountered an error. Please make sure the backend is running and you have uploaded documents.",
                sender: 'bot',
                error: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ id: 1, text: "Chat cleared. How can I help you now?", sender: 'bot' }]);
    };

    return (
        <div className="chat-container">
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Study Assistant Chat</h3>
                    <button onClick={clearChat} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Trash2 size={16} />
                        <span style={{ fontSize: '0.8rem' }}>Clear Chat</span>
                    </button>
                </div>

                <div className="messages" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`} style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            background: msg.sender === 'user' ? 'var(--primary)' : 'var(--background)',
                            color: msg.sender === 'user' ? 'white' : 'var(--text)',
                            border: msg.sender === 'bot' ? '1px solid var(--border)' : 'none',
                            marginBottom: '15px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', fontSize: '0.75rem', opacity: 0.8 }}>
                                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                <span>{msg.sender === 'user' ? 'You' : 'Assistant'}</span>
                            </div>
                            <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                            {msg.sources && msg.sources.length > 0 && (
                                <div style={{ marginTop: '10px', fontSize: '0.7rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '5px' }}>
                                    <strong>Sources: </strong> {Array.from(new Set(msg.sources)).join(', ')}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="message bot" style={{ alignSelf: 'flex-start', background: 'var(--background)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Loader2 className="animate-spin" size={16} />
                                <span>Assistant is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Ask a question about your study materials..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="btn-primary" onClick={handleSend} disabled={loading} style={{ padding: '8px 16px' }}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
