import React, { useState } from 'react';
import './CategoryManager.css';

function CategoryManager({ categories, onAdd, onDelete }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({ name });
      setName('');
    }
  };

  return (
    <div className="category-manager">
      <h2>Manage Categories</h2>
      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" className="btn-add">Add Category</button>
      </form>
      <div className="categories-grid">
        {categories.length === 0 ? (
          <p>No categories yet. Add one to get started!</p>
        ) : (
          categories.map(category => (
            <div key={category.id} className="category-card">
              <h3>{category.name}</h3>
              <button className="btn-delete" onClick={() => onDelete(category.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryManager;
