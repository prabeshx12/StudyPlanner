import React, { useState } from 'react';
import axios from 'axios';
import { Upload as UploadIcon, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
        if (!file) return;
        setStatus('uploading');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const resp = await axios.post('http://localhost:8000/upload/', formData);
            setStatus('success');
            setMessage(`Success! Processed ${resp.data.chunks} sections from ${resp.data.filename}.`);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.detail || 'Failed to upload document.');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Upload Study Materials</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                Upload your syllabus, PDFs, or notes. Our AI will index them for personalized learning and quiz generation.
            </p>

            <div
                className="glass"
                style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    cursor: 'pointer',
                    position: 'relative'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                }}
            >
                <input
                    type="file"
                    accept=".pdf"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    {file ? (
                        <FileText size={48} color="var(--primary)" />
                    ) : (
                        <UploadIcon size={48} color="var(--text-muted)" />
                    )}
                    <div>
                        <p style={{ fontWeight: '600' }}>{file ? file.name : 'Click or Drag PDF here'}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Max file size: 20MB (PDF only)</p>
                    </div>
                </div>
            </div>

            {status === 'idle' && file && (
                <button className="btn-primary" style={{ width: '100%' }} onClick={handleUpload}>
                    Start Processing
                </button>
            )}

            {status === 'uploading' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--accent)' }}>
                    <Loader2 className="animate-spin" />
                    <span>Analyzing your document... This may take a moment.</span>
                </div>
            )}

            {status === 'success' && (
                <div className="glass" style={{ padding: '15px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(5, 150, 105, 0.1)', border: '1px solid var(--success)' }}>
                    <CheckCircle size={20} />
                    <span>{message}</span>
                </div>
            )}

            {status === 'error' && (
                <div className="glass" style={{ padding: '15px', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--error)' }}>
                    <XCircle size={20} />
                    <span>{message}</span>
                </div>
            )}
        </div>
    );
};

export default Upload;
