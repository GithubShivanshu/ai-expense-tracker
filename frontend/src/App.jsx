import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import AIInput from './components/AIInput';
import './index.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, breakdown: {} });
  const [aiData, setAiData] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const handleAddExpense = async (data) => {
    try {
      await axios.post(`${API_BASE}/expenses`, data);
      fetchExpenses();
      fetchSummary();
      setAiData(null); // Clear AI data after successful add
    } catch (err) {
      console.error("Failed to add expense", err);
      alert("Failed to add expense. Check console for details.");
    }
  };

  const handleAIParsed = (parsedData) => {
    setAiData(parsedData);
  };

  return (
    <div className="container">
      <h1 className="title">AI Expense Tracker</h1>
      
      <div className="card">
        <h3>✨ Add Expense via AI</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          Just type what you spent today (e.g., "I spent $45 on groceries and $20 on gas yesterday")
        </p>
        <AIInput onParsed={handleAIParsed} apiBase={API_BASE} />
      </div>

      <div className="grid">
        <div className="column">
          <div className="card">
            <h3>Add Expense</h3>
            <AddExpenseForm onAdd={handleAddExpense} prefillData={aiData} />
          </div>
          <div className="card">
            <Summary total={summary.total} breakdown={summary.breakdown} />
          </div>
        </div>
        
        <div className="column">
          <div className="card">
            <h3>Recent Expenses</h3>
            <ExpenseList expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
