import React from 'react'

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome to Your Meal Planner!</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-gray-600">
          <p className="text-lg">
            Get started with your weekly meal planning journey! Here's what you can do:
          </p>

          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-500">
                1
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Plan Your Meals</h3>
                <p>Click on any cell in the meal planner grid to add breakfast, lunch, or dinner for each day.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                2
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Explore Recipes</h3>
                <p>Search for recipes, view detailed instructions, and watch cooking videos to find the perfect meal.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-500">
                3
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Generate Shopping Lists</h3>
                <p>Automatically create shopping lists based on your meal plan and export them for easy shopping.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal 