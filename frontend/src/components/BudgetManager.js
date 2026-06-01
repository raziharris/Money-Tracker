import React, { useState } from 'react';
import './BudgetManager.css';

function BudgetManager({ budgets, categories, transactions, onAdd, onDelete }) {
  const [formData, setFormData] = useState({
    category_id: '',
    limit: '',
    month: new Date().toISOString().substring(0, 7),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.category_id && formData.limit) {
      onAdd(formData);
      setFormData({
        category_id: '',
        limit: '',
        month: new Date().toISOString().substring(0, 7),
      });
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getSpentAmount = (categoryId, month) => {
    return transactions
      .filter(t => t.category_id === categoryId && t.date.startsWith(month) && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getProgress = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

  return (
    <div className="budget-manager">
      <h2>Budget Management</h2>
      <form onSubmit={handleSubmit} className="budget-form">
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
          <label>Budget Limit</label>
          <input
            type="number"
            name="limit"
            placeholder="0.00"
            step="0.01"
            value={formData.limit}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Month</label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Add Budget</button>
      </form>

      <div className="budgets-list">
        {budgets.length === 0 ? (
          <p>No budgets set. Create one to track your spending!</p>
        ) : (
          budgets.map(budget => {
            const spent = getSpentAmount(budget.category_id, budget.month);
            const progress = getProgress(spent, budget.limit);
            const isOverBudget = spent > budget.limit;

            return (
              <div key={budget.id} className={`budget-card ${isOverBudget ? 'over-budget' : ''}`}>
                <div className="budget-header">
                  <h3>{getCategoryName(budget.category_id)}</h3>
                  <span className="budget-month">{budget.month}</span>
                </div>
                <div className="budget-info">
                  <p>Limit: <strong>${budget.limit.toFixed(2)}</strong></p>
                  <p>Spent: <strong>${spent.toFixed(2)}</strong></p>
                  <p>Remaining: <strong>${(budget.limit - spent).toFixed(2)}</strong></p>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                {isOverBudget && <p className="warning">Over budget!</p>}
                <button className="btn-delete" onClick={() => onDelete(budget.id)}>Delete Budget</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BudgetManager;
