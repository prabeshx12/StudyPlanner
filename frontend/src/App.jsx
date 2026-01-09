import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Upload from './components/Upload';
import Quiz from './components/Quiz';
import Analytics from './components/Analytics';
import { BookOpen, MessageSquare, Upload as UploadIcon, BarChart, Settings } from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState('chat');

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
                        <h1 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>AI Study Assistant</h1>
                        <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0' }}>Master your exams with AI-powered insights</p>
                    </div>
                    <div className="glass" style={{ padding: '8px 16px', borderRadius: 'full' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Ready to Learn</span>
                    </div>
                </header>

                <div className="content-area fade-in" style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingTop: '10px' }}>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default App;
