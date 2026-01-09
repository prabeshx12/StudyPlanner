import React, { useState } from 'react';
import axios from 'axios';
import { BookOpen, CheckCircle2, XCircle, AlertCircle, Loader2, ArrowRight, RefreshCw } from 'lucide-react';

const Quiz = () => {
    const [numQuestions, setNumQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [error, setError] = useState('');

    const generateQuiz = async () => {
        setLoading(true);
        setError('');
        try {
            const resp = await axios.get(`http://localhost:8000/quiz/generate?num_questions=${numQuestions}`);
            setQuestions(resp.data);
            setCurrentIdx(0);
            setScore(0);
            setQuizFinished(false);
            setShowResult(false);
            setSelectedOption(null);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to generate quiz. Make sure you have uploaded documents.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (option) => {
        if (showResult) return;
        setSelectedOption(option);
        setShowResult(true);
        if (option === questions[currentIdx].answer) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setShowResult(false);
        } else {
            // Quiz finished - save results to localStorage
            const finalScore = score;
            const quizResult = {
                date: new Date().toISOString(),
                totalQuestions: questions.length,
                score: finalScore,
                percentage: Math.round((finalScore / questions.length) * 100)
            };

            const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
            existingResults.push(quizResult);
            if (existingResults.length > 20) existingResults.shift();
            localStorage.setItem('quizResults', JSON.stringify(existingResults));

            setQuizFinished(true);
        }
    };

    if (loading) {
        return (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <Loader2 size={48} className="animate-spin" color="var(--primary)" />
                <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Generating your personalized quiz...</p>
            </div>
        );
    }

    if (quizFinished) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 20px' }} />
                <h2 style={{ marginBottom: '10px' }}>Quiz Completed!</h2>
                <div style={{ fontSize: '3rem', fontWeight: '800', margin: '20px 0', color: 'var(--primary)' }}>
                    {score} / {questions.length}
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                    Great effort! You've mastered {Math.round((score / questions.length) * 100)}% of this material.
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={() => generateQuiz()}>Try Another</button>
                    <button className="glass" style={{ padding: '10px 20px', borderRadius: '8px' }} onClick={() => setQuestions([])}>Go Back</button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '20px' }}>Generate Practice Quiz</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                    Challenge yourself with AI-generated questions based on your study materials.
                </p>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem' }}>Number of Questions</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[5, 10, 15].map(num => (
                            <button
                                key={num}
                                onClick={() => setNumQuestions(num)}
                                className="glass"
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: numQuestions === num ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    color: numQuestions === num ? 'var(--primary)' : 'var(--text)',
                                    fontWeight: numQuestions === num ? '700' : '400'
                                }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="glass" style={{ padding: '15px', marginBottom: '20px', color: 'var(--error)', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--error)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <button className="btn-primary" style={{ width: '100%' }} onClick={generateQuiz}>
                    Generate Quiz
                </button>
            </div>
        );
    }

    const currentQ = questions[currentIdx];

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Question {currentIdx + 1} of {questions.length}</span>
                <div style={{ background: 'var(--border)', height: '6px', width: '200px', borderRadius: '3px' }}>
                    <div style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                </div>
            </div>

            <h3 style={{ marginBottom: '30px', lineHeight: '1.4' }}>{currentQ.question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                {Object.entries(currentQ.options).map(([key, value]) => {
                    let background = 'var(--background)';
                    let border = 'var(--border)';
                    let icon = null;

                    if (showResult) {
                        if (key === currentQ.answer) {
                            background = 'rgba(5, 150, 105, 0.1)';
                            border = 'var(--success)';
                            icon = <CheckCircle2 size={18} color="var(--success)" />;
                        } else if (key === selectedOption) {
                            background = 'rgba(220, 38, 38, 0.1)';
                            border = 'var(--error)';
                            icon = <XCircle size={18} color="var(--error)" />;
                        }
                    } else if (selectedOption === key) {
                        border = 'var(--primary)';
                    }

                    return (
                        <button
                            key={key}
                            onClick={() => handleAnswer(key)}
                            className="glass"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                textAlign: 'left',
                                background,
                                border: `1px solid ${border}`,
                                cursor: showResult ? 'default' : 'pointer'
                            }}
                        >
                            <span style={{ fontWeight: '800', width: '20px' }}>{key}</span>
                            <span style={{ flex: 1 }}>{value}</span>
                            {icon}
                        </button>
                    );
                })}
            </div>

            {showResult && (
                <div className="fade-in">
                    <div className="glass" style={{ padding: '20px', marginBottom: '30px', borderLeft: `4px solid ${selectedOption === currentQ.answer ? 'var(--success)' : 'var(--error)'}` }}>
                        <p style={{ fontWeight: '600', marginBottom: '8px' }}>Explanation:</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{currentQ.explanation}</p>
                    </div>
                    <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={nextQuestion}>
                        {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
