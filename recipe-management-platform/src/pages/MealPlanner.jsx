import React, { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'
import ShoppingList from './ShoppingList'
import ExportModal from '../components/ExportModal'
import WelcomeModal from '../components/WelcomeModal'

const WELCOME_SHOWN_KEY = 'welcomeModalShown'

const MealPlanner = () => {
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false)
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(() => {
    // Check if welcome modal has been shown before
    return !localStorage.getItem(WELCOME_SHOWN_KEY)
  })
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)
  const [customMealName, setCustomMealName] = useState('')

  const {
    mealPlan,
    addMealToDay,
    removeMealFromDay,
    clearMealPlan,
    MEALS,
    DAYS
  } = usePlanner()

  useEffect(() => {
    console.log('MealPlanner mounted')
    console.log('Context values:', { mealPlan, MEALS, DAYS })
    
    // Check if there's an existing meal plan
    const hasMealPlan = Object.keys(mealPlan || {}).length > 0
    console.log('Has meal plan:', hasMealPlan)
    if (hasMealPlan) {
      setIsWelcomeModalOpen(false)
    }
  }, [mealPlan])

  const handleCloseWelcomeModal = () => {
    setIsWelcomeModalOpen(false)
    localStorage.setItem(WELCOME_SHOWN_KEY, 'true')
  }

  // Fallback values in case context fails
  const days = DAYS || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const meals = MEALS || ['breakfast', 'lunch', 'dinner']

  const handleAddMeal = (day, meal) => {
    setSelectedDay(day)
    setSelectedMeal(meal)
    setSearchQuery('')
    setSearchResults([])
    setError(null)
    setCustomMealName('')
    setIsRecipeModalOpen(true)
  }

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe)
    setIsDetailsOpen(true)
  }

  const searchRecipes = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery.trim())}`)
      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }
      const data = await response.json()
      if (data.meals) {
        setSearchResults(data.meals)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error searching recipes:', error)
      setError('Failed to search recipes. Please try again.')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    searchRecipes()
  }

  const handleAddCustomMeal = (e) => {
    e.preventDefault()
    if (customMealName.trim()) {
      addMealToDay(selectedDay, selectedMeal, customMealName.trim())
      setIsRecipeModalOpen(false)
      setCustomMealName('')
    }
  }

  const selectRecipe = (recipe) => {
    addMealToDay(selectedDay, selectedMeal, recipe)
    setIsRecipeModalOpen(false)
  }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
            Meal Planner
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => setIsExportOpen(true)}
              className="button-primary inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
            <button
              onClick={() => setIsShoppingListOpen(!isShoppingListOpen)}
              className="button-secondary inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Shopping List
            </button>
            <button
              onClick={clearMealPlan}
              className="button-danger inline-flex items-center"
            >
              Clear Plan
            </button>
          </div>
        </div>

        {/* Meal Grid */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="grid grid-cols-8 gap-4 p-6">
            {/* Header row */}
            <div className="col-span-1"></div>
            {days.map(day => (
              <div key={day} className="text-center font-semibold text-responsive">
                {capitalize(day)}
              </div>
            ))}

            {/* Meal rows */}
            {meals.map(meal => (
              <React.Fragment key={meal}>
                <div className="font-semibold capitalize text-responsive">{meal}</div>
                {days.map(day => (
                  <div
                    key={`${day}-${meal}`}
                    className="grid-cell hover-card"
                  >
                    {mealPlan && mealPlan[day] && mealPlan[day][meal] ? (
                      <div className="space-y-2 p-3 animate-fade-in">
                        <p
                          onClick={() => !mealPlan[day][meal].isCustom && handleViewRecipe(mealPlan[day][meal])}
                          className={`text-sm font-medium ${!mealPlan[day][meal].isCustom ? 'cursor-pointer hover:text-blue-600' : ''} truncate`}
                        >
                          {mealPlan[day][meal].strMeal}
                        </p>
                        <button
                          onClick={() => removeMealFromDay(day, meal)}
                          className="w-full px-2 py-1 text-xs button-danger"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddMeal(day, meal)}
                        className="w-full h-full px-3 py-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 rounded-md"
                      >
                        Add Meal
                      </button>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Search Modal */}
      {isRecipeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto modal-overlay">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsRecipeModalOpen(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full modal-content glass-effect">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    Add Meal for {capitalize(selectedMeal)} on {capitalize(selectedDay)}
                  </h2>
                  <button
                    onClick={() => setIsRecipeModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Custom Meal Input */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Add Custom Meal</h3>
                  <form onSubmit={handleAddCustomMeal} className="flex gap-4">
                    <input
                      type="text"
                      value={customMealName}
                      onChange={(e) => setCustomMealName(e.target.value)}
                      placeholder="Enter custom meal name..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!customMealName.trim()}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      Add Custom Meal
                    </button>
                  </form>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Search Recipes</h3>
                  <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for recipes..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      disabled={loading || !searchQuery.trim()}
                    >
                      {loading ? 'Searching...' : 'Search'}
                    </button>
                  </form>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {searchResults.map(recipe => (
                      <div
                        key={recipe.idMeal}
                        onClick={() => selectRecipe(recipe)}
                        className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <img
                          src={recipe.strMealThumb}
                          alt={recipe.strMeal}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div>
                          <h4 className="font-medium">{recipe.strMeal}</h4>
                          <p className="text-sm text-gray-500">{recipe.strCategory}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal */}
      {isWelcomeModalOpen && (
        <WelcomeModal onClose={handleCloseWelcomeModal} />
      )}

      {/* Shopping List Modal */}
      {isShoppingListOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto modal-overlay">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsShoppingListOpen(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full modal-content glass-effect">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsShoppingListOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ShoppingList />
            </div>
          </div>
        </div>
      )}

      {/* Recipe Details Modal */}
      {isDetailsOpen && selectedRecipe && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => {
            setIsDetailsOpen(false)
            setSelectedRecipe(null)
          }}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">{selectedRecipe.strMeal}</h2>
                  <button
                    onClick={() => {
                      setIsDetailsOpen(false)
                      setSelectedRecipe(null)
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedRecipe.strMealThumb}
                      alt={selectedRecipe.strMeal}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                      <ul className="space-y-2">
                        {Array.from({ length: 20 }).map((_, i) => {
                          const ingredient = selectedRecipe[`strIngredient${i + 1}`]
                          const measure = selectedRecipe[`strMeasure${i + 1}`]
                          if (ingredient && ingredient.trim()) {
                            return (
                              <li key={i} className="text-gray-600">
                                {measure && measure.trim() ? `${measure} - ` : ''}{ingredient}
                              </li>
                            )
                          }
                          return null
                        })}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Instructions</h3>
                    <p className="text-gray-600 whitespace-pre-line">{selectedRecipe.strInstructions}</p>
                    {selectedRecipe.strYoutube && (
                      <div className="mt-4">
                        <h3 className="text-lg font-medium mb-2">Video Tutorial</h3>
                        <a
                          href={selectedRecipe.strYoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm3.11 10.385l-4.5 3A.667.667 0 017 12.8V7.2a.667.667 0 011.11-.515l4.5 3a.667.667 0 010 1.13z" />
                          </svg>
                          Watch on YouTube
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExportOpen && (
        <ExportModal onClose={() => setIsExportOpen(false)} />
      )}
    </div>
  )
}

export default MealPlanner 