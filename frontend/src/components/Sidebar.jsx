import React, { useState, useEffect } from 'react';
import { MessageSquare, Upload, BookOpen, BarChart, Database } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const [storageUsage, setStorageUsage] = useState(0);

    useEffect(() => {
        // Calculate localStorage usage
        const calculateStorage = () => {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            // Convert to KB and calculate percentage (assuming 5MB limit)
            const usageKB = total / 1024;
            const percentage = Math.min(100, (usageKB / 5120) * 100);
            setStorageUsage(Math.round(percentage));
        };

        calculateStorage();
        // Update every 5 seconds
        const interval = setInterval(calculateStorage, 5000);
        return () => clearInterval(interval);
    }, []);

    const menuItems = [
        { id: 'chat', label: 'Study Chat', icon: MessageSquare },
        { id: 'upload', label: 'Upload Content', icon: Upload },
        { id: 'quiz', label: 'Practice Quiz', icon: BookOpen },
        { id: 'analytics', label: 'Progress', icon: BarChart },
    ];

    return (
        <aside className="glass" style={{ width: '260px', margin: '20px', height: 'calc(100% - 40px)', borderRadius: '24px', display: 'flex', flexDirection: 'column', padding: '30px 15px', flexShrink: 0 }}>
            <div style={{ marginBottom: '40px', paddingLeft: '15px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text)' }}>Study<span style={{ color: 'var(--primary)' }}>Planner</span></h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Organize your learning</p>
            </div>

            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 20px',
                                marginBottom: '8px',
                                borderRadius: '12px',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                color: isActive ? 'white' : 'var(--text-muted)',
                                border: 'none',
                                textAlign: 'left',
                                fontWeight: isActive ? '600' : '400',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <Icon size={20} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="glass" style={{ padding: '15px', borderRadius: '12px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Database size={16} color="var(--text-muted)" />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Storage: {storageUsage}%</p>
                </div>
                <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
                    <div style={{
                        width: `${storageUsage}%`,
                        height: '100%',
                        background: storageUsage > 80 ? 'var(--error)' : 'var(--accent)',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
