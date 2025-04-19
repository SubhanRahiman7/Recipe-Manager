import { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'

const ShoppingList = ({ onClose }) => {
  const { getShoppingList, addToShoppingList, removeFromShoppingList, clearMealPlan } = usePlanner()
  const [ingredients, setIngredients] = useState({})
  const [newItem, setNewItem] = useState('')
  const [newMeasure, setNewMeasure] = useState('')
  
  useEffect(() => {
    const loadShoppingList = () => {
      const list = getShoppingList()
      setIngredients(list)
    }
    
    loadShoppingList()
    
    // Listen for storage events to sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'shoppingList') {
        loadShoppingList()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      setIngredients({})
    }
  }, [getShoppingList])
  
  const handleAddItem = (e) => {
    e.preventDefault()
    if (newItem.trim()) {
      addToShoppingList(newItem.trim(), newMeasure.trim())
      // Immediately update the local state
      const updatedList = getShoppingList()
      setIngredients(updatedList)
      setNewItem('')
      setNewMeasure('')
    }
  }

  const handleRemoveItem = (ingredient) => {
    removeFromShoppingList(ingredient)
    // Immediately update the local state
    const updatedList = getShoppingList()
    setIngredients(updatedList)
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all items from the shopping list?')) {
      clearMealPlan() // This will clear both meal plan and shopping list
      setIngredients({})
    }
  }

  const handleClose = () => {
    setIngredients({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Shopping List</h2>
              <p className="text-sm text-gray-500 mt-1">
                Add or remove items from your shopping list
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium rounded-md hover:bg-red-50"
              >
                Clear All
              </button>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Add Item Form */}
            <form onSubmit={handleAddItem} className="mb-6 flex gap-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add new item..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={newMeasure}
                onChange={(e) => setNewMeasure(e.target.value)}
                placeholder="Quantity (optional)"
                className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newItem.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </form>

            {/* Shopping List */}
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
              {Object.keys(ingredients).length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No ingredients needed. Add some meals to your plan or add items manually!
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(ingredients).map(([ingredient, measures]) => (
                    <div
                      key={ingredient}
                      className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md group"
                    >
                      <input
                        type="checkbox"
                        onChange={() => handleRemoveItem(ingredient)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-medium">{ingredient}</span>
                        {measures.length > 0 && (
                          <div className="text-sm text-gray-500">
                            {measures.map((measure, index) => (
                              <span key={index}>
                                {measure}
                                {index < measures.length - 1 ? ' or ' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(ingredient)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingList 