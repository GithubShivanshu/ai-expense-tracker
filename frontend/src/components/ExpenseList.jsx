import React from 'react';

function ExpenseList({ expenses }) {
    if (!expenses || expenses.length === 0) {
        return <p style={{ color: 'var(--text-muted)' }}>No expenses recorded yet.</p>;
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    return (
        <div>
            {expenses.map(exp => (
                <div key={exp.id} className="expense-item">
                    <div className="expense-info">
                        <h4>{exp.title}</h4>
                        <div className="expense-meta">
                            <span className="badge">{exp.category}</span>
                            <span>{exp.date}</span>
                        </div>
                    </div>
                    <div className="expense-amount">
                        {formatCurrency(exp.amount)}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ExpenseList;