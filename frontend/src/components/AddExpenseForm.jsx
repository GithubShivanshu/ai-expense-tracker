import React, { useState } from 'react';

function AddExpenseForm({ onAdd, prefillData }) {

    const todayStr = new Date().toISOString().split('T')[0];

    const initialState = {
        title: '',
        amount: '',
        category: 'Misc',
        date: todayStr
    };

    const [formData, setFormData] = useState(initialState);

    // If AI prefill data exists, override formData dynamically
    const effectiveData = prefillData
        ? {
            title: prefillData.title || '',
            amount: prefillData.amount ?? '',
            category: prefillData.category || 'Misc',
            date: prefillData.date || todayStr
        }
        : formData;

    const handleChange = (e) => {
        setFormData({
            ...effectiveData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!effectiveData.title || !effectiveData.amount) {
            alert("Title and amount are required!");
            return;
        }

        onAdd({
            ...effectiveData,
            amount: parseFloat(effectiveData.amount)
        });

        setFormData(initialState);
    };

    return (
        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <label>Title</label>
                <input
                    name="title"
                    className="form-control"
                    value={effectiveData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Amount (₹)</label>
                <input
                    name="amount"
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={effectiveData.amount}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Category</label>
                <input
                    name="category"
                    className="form-control"
                    value={effectiveData.category}
                    onChange={handleChange}
                    placeholder="e.g. Food, Transport, Utilities"
                />
            </div>

            <div className="form-group">
                <label>Date</label>
                <input
                    name="date"
                    type="date"
                    className="form-control"
                    value={effectiveData.date}
                    onChange={handleChange}
                />
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" className="btn">
                    Add Expense
                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setFormData(initialState)}
                >
                    Clear
                </button>
            </div>

        </form>
    );
}

export default AddExpenseForm;