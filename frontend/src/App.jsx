import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Upload from './components/Upload';
import Quiz from './components/Quiz';
import Analytics from './components/Analytics';
import { BookOpen, MessageSquare, Upload as UploadIcon, BarChart, Settings, Wifi, WifiOff } from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState('chat');
    const [isBackendOnline, setIsBackendOnline] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                await axios.get('http://localhost:8000/');
                setIsBackendOnline(true);
            } catch (err) {
                setIsBackendOnline(false);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'upload': return <Upload />;
            case 'chat': return <Chat />;
            case 'quiz': return <Quiz />;
            case 'analytics': return <Analytics />;
            default: return <Chat />;
        }
    };

    return (
        <div className="app-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <header style={{ padding: '20px', paddingBottom: '10px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--text)' }}>Study Planner</h1>
                        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>Academic content at your fingertips</p>
                    </div>
                    <div className="glass" style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: isBackendOnline ? 'rgba(5, 150, 105, 0.1)' : 'rgba(225, 29, 72, 0.1)',
                        border: `1px solid ${isBackendOnline ? 'var(--success)' : 'var(--error)'}`
                    }}>
                        {isBackendOnline ? <Wifi size={14} color="var(--success)" /> : <WifiOff size={14} color="var(--error)" />}
                        <span style={{
                            fontSize: '0.85rem',
                            color: isBackendOnline ? 'var(--success)' : 'var(--error)',
                            fontWeight: '600'
                        }}>
                            {isBackendOnline ? 'Active Session' : 'Offline'}
                        </span>
                    </div>
                </header>

                <div className="content-area fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '20px', paddingTop: '10px' }}>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default App;
