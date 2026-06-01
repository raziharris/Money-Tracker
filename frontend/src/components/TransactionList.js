import React, { useState } from 'react';
import './TransactionList.css';

function TransactionList({ transactions, onDelete, onUpdate, categories }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleEdit = (transaction) => {
    setEditId(transaction.id);
    setEditData(transaction);
  };

  const handleSave = () => {
    onUpdate(editId, editData);
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="transaction-list">
      <h2>Transactions</h2>
      {sortedTransactions.length === 0 ? (
        <p className="no-transactions">No transactions yet. Add one to get started!</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map(transaction => (
                <tr key={transaction.id} className={transaction.type}>
                  {editId === transaction.id ? (
                    <>
                      <td><input type="date" name="date" value={editData.date} onChange={handleInputChange} /></td>
                      <td><input type="text" name="description" value={editData.description} onChange={handleInputChange} /></td>
                      <td>
                        <select name="category_id" value={editData.category_id} onChange={handleInputChange}>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select name="type" value={editData.type} onChange={handleInputChange}>
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </td>
                      <td><input type="number" name="amount" step="0.01" value={editData.amount} onChange={handleInputChange} /></td>
                      <td>
                        <button className="btn-save" onClick={handleSave}>Save</button>
                        <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{transaction.date}</td>
                      <td>{transaction.description}</td>
                      <td>{getCategoryName(transaction.category_id)}</td>
                      <td><span className={`badge ${transaction.type}`}>{transaction.type}</span></td>
                      <td className={`amount ${transaction.type}`}>${transaction.amount.toFixed(2)}</td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(transaction)}>Edit</button>
                        <button className="btn-delete" onClick={() => onDelete(transaction.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
