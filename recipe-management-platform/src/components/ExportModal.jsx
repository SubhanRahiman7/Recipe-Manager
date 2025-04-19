import { useState } from 'react'
import { usePlanner } from '../context/PlannerContext'

const ExportModal = ({ onClose }) => {
  const [exportType, setExportType] = useState('all') // 'all', 'mealplan', or 'shopping'
  const { mealPlan, getShoppingList, DAYS, MEALS } = usePlanner()

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    const ingredients = getShoppingList()

    printWindow.document.write(`
      <html>
        <head>
          <title>Meal Plan & Shopping List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            h1, h2 { color: #333; }
            .meal { margin-bottom: 5px; }
            .shopping-item { margin-bottom: 10px; }
            .measures { color: #666; font-style: italic; }
            @media print {
              button { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${(exportType === 'all' || exportType === 'mealplan') ? `
            <h1>Weekly Meal Plan</h1>
            <table>
              <tr>
                <th></th>
                ${DAYS.map(day => `<th>${day.charAt(0).toUpperCase() + day.slice(1)}</th>`).join('')}
              </tr>
              ${MEALS.map(meal => `
                <tr>
                  <th>${meal.charAt(0).toUpperCase() + meal.slice(1)}</th>
                  ${DAYS.map(day => `
                    <td>
                      ${mealPlan[day]?.[meal]?.strMeal || '-'}
                    </td>
                  `).join('')}
                </tr>
              `).join('')}
            </table>
          ` : ''}

          ${(exportType === 'all' || exportType === 'shopping') ? `
            <h1>Shopping List</h1>
            ${Object.entries(ingredients).map(([ingredient, measures]) => `
              <div class="shopping-item">
                <strong>${ingredient}</strong>
                <div class="measures">${measures.join(', ')}</div>
              </div>
            `).join('')}
          ` : ''}

          <button onclick="window.print(); window.close();" style="margin-top: 20px; padding: 10px 20px; background-color: #0ea5e9; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print
          </button>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Export Plan</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">What would you like to export?</label>
                <div className="mt-3 space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="all"
                      checked={exportType === 'all'}
                      onChange={(e) => setExportType(e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3">Complete Plan (Meal Plan & Shopping List)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="mealplan"
                      checked={exportType === 'mealplan'}
                      onChange={(e) => setExportType(e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3">Meal Plan Only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="shopping"
                      checked={exportType === 'shopping'}
                      onChange={(e) => setExportType(e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3">Shopping List Only</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export & Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal 