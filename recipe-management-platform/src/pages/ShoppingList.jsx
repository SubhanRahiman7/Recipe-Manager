import React, { useState, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';

export default function ShoppingList() {
  const { getShoppingList, addToShoppingList, removeFromShoppingList } = usePlanner();
  const [ingredients, setIngredients] = useState({});
  const [newItem, setNewItem] = useState('');
  const [newMeasure, setNewMeasure] = useState('');

  useEffect(() => {
    const list = getShoppingList();
    setIngredients(list);
  }, [getShoppingList]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      addToShoppingList(newItem.trim(), newMeasure.trim());
      setNewItem('');
      setNewMeasure('');
      setIngredients(getShoppingList());
    }
  };

  const handleRemoveItem = (ingredient) => {
    removeFromShoppingList(ingredient);
    setIngredients(getShoppingList());
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text">
        Shopping List
      </h1>
      
      <form onSubmit={handleAddItem} className="mb-6 animate-slide-in">
        <div className="flex gap-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item..."
            className="input-primary flex-1"
          />
          <input
            type="text"
            value={newMeasure}
            onChange={(e) => setNewMeasure(e.target.value)}
            placeholder="Quantity (optional)"
            className="input-primary w-32"
          />
          <button
            type="submit"
            className="button-primary"
          >
            Add Item
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-lg p-6 glass-effect">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(ingredients).map(([ingredient, measures], index) => (
            <div
              key={ingredient}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 animate-fade-in hover-card"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  onChange={() => handleRemoveItem(ingredient)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="text-responsive">
                  {ingredient}
                  {measures.length > 0 && (
                    <span className="text-gray-500 ml-2">
                      ({measures.join(', ')})
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={() => handleRemoveItem(ingredient)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform hover:scale-110 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          {Object.keys(ingredients).length === 0 && (
            <div className="text-gray-500 text-center py-8 animate-fade-in">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg">No items in your shopping list</p>
              <p className="text-sm mt-2">Add items using the form above or from your meal plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}