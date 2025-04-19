import React, { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'
import html2pdf from 'html2pdf.js'

const ShoppingList = () => {
  const { getShoppingList } = usePlanner()
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [newQuantity, setNewQuantity] = useState('')
  const [checkedItems, setCheckedItems] = useState(new Set())

  // Load items from meal plan
  useEffect(() => {
    const mealPlanItems = getShoppingList()
    const formattedItems = Object.entries(mealPlanItems).map(([name, measures]) => ({
      name,
      quantity: measures.join(' or '),
      fromMealPlan: true
    }))
    setItems(formattedItems)
  }, [getShoppingList])

  const addItem = (e) => {
    e.preventDefault()
    if (!newItem.trim()) return

    setItems(prev => [
      ...prev,
      {
        name: newItem.trim(),
        quantity: newQuantity.trim(),
        fromMealPlan: false
      }
    ])
    setNewItem('')
    setNewQuantity('')
  }

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const toggleItem = (index) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
  }

  const clearChecked = () => {
    setCheckedItems(new Set())
  }

  const exportToPDF = () => {
    const element = document.getElementById('shopping-list-content')
    const opt = {
      margin: 1,
      filename: 'shopping-list.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shopping List</h2>
          <div className="space-x-4">
            <button
              onClick={clearChecked}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear Checked
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export to PDF
            </button>
          </div>
        </div>

        {/* Add Item Form */}
        <form onSubmit={addItem} className="flex gap-4 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            placeholder="Quantity (optional)"
            className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Item
          </button>
        </form>

        {/* Shopping List */}
        <div id="shopping-list-content" className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Your shopping list is empty. Add items or create a meal plan to generate a list.
            </p>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center py-3 group"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems.has(index)}
                    onChange={() => toggleItem(index)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className={`flex-1 ml-3 ${checkedItems.has(index) ? 'line-through text-gray-400' : ''}`}>
                    <span className="font-medium">{item.name}</span>
                    {item.quantity && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({item.quantity})
                      </span>
                    )}
                  </div>
                  {!item.fromMealPlan && (
                    <button
                      onClick={() => removeItem(index)}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShoppingList