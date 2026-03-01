import React, { useState } from 'react';
import axios from 'axios';

function AIInput({ onParsed, apiBase }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleParse = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${apiBase}/ai-parse`, { text });
            onParsed(res.data);
            setText(''); // clear after parsing
        } catch (err) {
            console.error("AI parse failed", err);
            setError("AI Parsing failed. Check API key or try manually.");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div>
        <div className="ai-input-wrapper">
            <input
                type="text"
                className="form-control"
                placeholder="e.g. Spent 15 at Starbucks for coffee today"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleParse()}
                disabled={loading}
            />

            <button
                className="btn"
                onClick={handleParse}
                disabled={loading}
            >
                {loading ? 'Parsing...' : 'Parse'}
            </button>

            <button
                className="btn btn-secondary"
                onClick={() => {
                    setText('');
                    setError('');
                }}
                disabled={loading}
                style={{ marginLeft: '0.5rem' }}
            >
                Clear
            </button>
        </div>

        {error && <div className="error-message">{error}</div>}
    </div>
);
}

export default AIInput;
