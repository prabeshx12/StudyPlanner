import React, { useState, useEffect } from 'react';
import { BarChart as ChartIcon, Target, TrendingUp, Clock, Book, Award } from 'lucide-react';

const Analytics = () => {
    const [quizResults, setQuizResults] = useState([]);
    const [stats, setStats] = useState({
        quizzesCompleted: 0,
        avgAccuracy: 0,
        totalQuestions: 0,
        bestScore: 0
    });

    useEffect(() => {
        // Load quiz results from localStorage
        const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
        setQuizResults(results);

        if (results.length > 0) {
            const totalQuizzes = results.length;
            const avgAccuracy = Math.min(100, Math.round(
                results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes
            ));
            const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
            const bestScore = Math.min(100, Math.max(...results.map(r => r.percentage)));

            setStats({
                quizzesCompleted: totalQuizzes,
                avgAccuracy,
                totalQuestions,
                bestScore
            });
        }
    }, []);

    const statCards = [
        { label: 'Quizzes Completed', value: stats.quizzesCompleted, icon: Target, color: 'var(--success)' },
        { label: 'Avg. Accuracy', value: `${stats.avgAccuracy}%`, icon: TrendingUp, color: 'var(--primary)' },
        { label: 'Questions Answered', value: stats.totalQuestions, icon: Book, color: 'var(--accent)' },
        { label: 'Best Score', value: `${stats.bestScore}%`, icon: Award, color: 'var(--warning)' },
    ];

    // Get recent quiz history
    const recentQuizzes = quizResults.slice(-5).reverse();

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all your progress and quiz history? This cannot be undone.")) {
            localStorage.removeItem('quizResults');
            setQuizResults([]);
            setStats({
                quizzesCompleted: 0,
                avgAccuracy: 0,
                totalQuestions: 0,
                bestScore: 0
            });
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', height: '100%', overflowY: 'auto', paddingRight: '8px' }}>
            <div className="card" style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Study Progress Overview</h2>
                    <button
                        onClick={handleReset}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            color: 'var(--error)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                        }}
                    >
                        Reset Statistics
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    {statCards.map((stat, i) => (
                        <div key={i} className="glass" style={{ padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                            <stat.icon size={32} color={stat.color} style={{ margin: '0 auto 10px' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '20px' }}>Recent Quiz History</h3>
                {recentQuizzes.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                        No quiz history yet. Complete a quiz to see your progress!
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentQuizzes.map((quiz, i) => {
                            const date = new Date(quiz.date);
                            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            const cappedPercentage = Math.min(100, quiz.percentage);

                            return (
                                <div key={i} className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{quiz.score}/{quiz.totalQuestions} Correct</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {dateStr} at {timeStr}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '1.2rem',
                                            fontWeight: '700',
                                            color: cappedPercentage >= 80 ? 'var(--success)' : cappedPercentage >= 60 ? 'var(--accent)' : 'var(--error)'
                                        }}>
                                            {cappedPercentage}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '20px' }}>Performance Insights</h3>
                {quizResults.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                        Complete quizzes to get personalized insights!
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Overall Performance */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span>Overall Performance</span>
                                <span style={{
                                    color: stats.avgAccuracy >= 80 ? 'var(--success)' : stats.avgAccuracy >= 60 ? 'var(--accent)' : 'var(--error)'
                                }}>
                                    {stats.avgAccuracy}%
                                </span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px' }}>
                                <div style={{
                                    width: `${stats.avgAccuracy}%`,
                                    height: '100%',
                                    background: stats.avgAccuracy >= 80 ? 'var(--success)' : stats.avgAccuracy >= 60 ? 'var(--accent)' : 'var(--error)',
                                    borderRadius: '4px',
                                    transition: 'width 0.5s ease'
                                }}></div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div style={{ marginTop: '10px' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--accent)' }}>
                                Recommendations:
                            </h4>
                            <ul style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {stats.avgAccuracy < 60 && (
                                    <li>Review your study materials more thoroughly before taking quizzes</li>
                                )}
                                {stats.avgAccuracy >= 60 && stats.avgAccuracy < 80 && (
                                    <li>You're doing well! Focus on understanding concepts deeply</li>
                                )}
                                {stats.avgAccuracy >= 80 && (
                                    <li>Excellent work! Consider challenging yourself with more advanced topics</li>
                                )}
                                <li>Use the chat feature to clarify difficult concepts</li>
                                <li>Take regular quizzes to track your progress</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
