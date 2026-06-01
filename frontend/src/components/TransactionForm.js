import React, { useEffect, useState } from 'react';
import './TransactionForm.css';

function TransactionForm({ categories, onAdd, initialAmount = '' }) {
  const [formData, setFormData] = useState({
    amount: '',
    category_id: '',
    description: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialAmount) {
      setFormData(prev => ({ ...prev, amount: initialAmount }));
    }
  }, [initialAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.category_id && formData.description) {
      onAdd(formData);
      setFormData({
        amount: '',
        category_id: '',
        description: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <div className="transaction-form">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category_id" value={formData.category_id} onChange={handleChange} required>
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Add Transaction</button>
      </form>
    </div>
  );
}

export default TransactionForm;
