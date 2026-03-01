import React from 'react';

function Summary({ total, breakdown }) {

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);
    };

    const safeBreakdown = breakdown || {};

    const maxAmount = Object.values(safeBreakdown).reduce(
        (a, b) => Math.max(a, b),
        0
    );

    return (
        <div>
            <h3>Summary</h3>

            <div className="summary-total">
                {formatCurrency(total)}
            </div>

            <div style={{ marginTop: '2rem' }}>
                {Object.entries(safeBreakdown).map(([category, amount]) => {
                    const percent = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

                    return (
                        <div key={category} className="category-bar">
                            <div className="category-name">{category}</div>

                            <div className="category-progress">
                                <div
                                    className="category-progress-bar"
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>

                            <div className="category-amount">
                                {formatCurrency(amount)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Summary;