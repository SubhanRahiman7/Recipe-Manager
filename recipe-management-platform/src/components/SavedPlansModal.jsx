import { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'

const SavedPlansModal = ({ onClose }) => {
  const [planName, setPlanName] = useState('')
  const [savedPlans, setSavedPlans] = useState([])
  const { mealPlan, loadMealPlan } = usePlanner()

  useEffect(() => {
    // Load saved plans from localStorage
    const plans = JSON.parse(localStorage.getItem('savedMealPlans') || '[]')
    setSavedPlans(plans)
  }, [])

  const handleSavePlan = () => {
    if (!planName.trim()) return

    const newPlan = {
      id: Date.now(),
      name: planName,
      plan: mealPlan,
      createdAt: new Date().toISOString()
    }

    const updatedPlans = [...savedPlans, newPlan]
    localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans))
    setSavedPlans(updatedPlans)
    setPlanName('')
  }

  const handleLoadPlan = (plan) => {
    loadMealPlan(plan.plan)
    onClose()
  }

  const handleDeletePlan = (planId) => {
    const updatedPlans = savedPlans.filter(plan => plan.id !== planId)
    localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans))
    setSavedPlans(updatedPlans)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Saved Meal Plans</h2>
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
              {/* Save new plan */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Save Current Plan
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="Enter plan name"
                    className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSavePlan}
                    disabled={!planName.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Saved plans list */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Your Saved Plans</h3>
                {savedPlans.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No saved plans yet. Save your current plan to see it here.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {savedPlans.map(plan => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <h4 className="font-medium">{plan.name}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(plan.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLoadPlan(plan)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavedPlansModal 