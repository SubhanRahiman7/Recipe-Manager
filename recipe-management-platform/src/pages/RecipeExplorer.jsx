import React, { useState, useEffect } from 'react'

const RecipeExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const searchRecipes = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setSelectedRecipe(null)
    try {
      let url
      if (selectedCategory === 'all') {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery.trim())}`
      } else {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(selectedCategory)}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }
      const data = await response.json()
      
      // If searching by category, fetch full recipe details for each meal
      if (selectedCategory !== 'all' && data.meals) {
        const fullRecipes = await Promise.all(
          data.meals.map(async (meal) => {
            const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
            const detailData = await detailResponse.json()
            return detailData.meals[0]
          })
        )
        setRecipes(fullRecipes.filter(recipe => 
          recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      } else {
        setRecipes(data.meals || [])
      }
    } catch (error) {
      console.error('Error searching recipes:', error)
      setError('Failed to fetch recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getRandomRecipes = async () => {
    setLoading(true)
    setError(null)
    setSelectedRecipe(null)
    try {
      const recipes = []
      // Fetch 6 random recipes
      for (let i = 0; i < 6; i++) {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        const data = await response.json()
        if (data.meals?.[0]) {
          recipes.push(data.meals[0])
        }
      }
      setRecipes(recipes)
    } catch (error) {
      console.error('Error fetching random recipes:', error)
      setError('Failed to fetch random recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getYouTubeUrl = (youtubeLink) => {
    if (!youtubeLink) return null
    // Convert watch URLs to embed URLs
    return youtubeLink.replace('watch?v=', 'embed/')
  }

  // Modal component for recipe details
  const RecipeModal = ({ recipe, onClose }) => {
    if (!recipe) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">{recipe.strMeal}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 space-y-8">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-96 object-cover rounded-lg"
            />

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {recipe.strCategory}
              </span>
              {recipe.strArea && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {recipe.strArea}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 20 }).map((_, i) => {
                  const ingredient = recipe[`strIngredient${i + 1}`]
                  const measure = recipe[`strMeasure${i + 1}`]
                  if (ingredient && ingredient.trim()) {
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-700">
                          {measure} {ingredient}
                        </span>
                      </div>
                    )
                  }
                  return null
                }).filter(Boolean)}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Instructions</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {recipe.strInstructions}
              </p>
            </div>

            {recipe.strYoutube && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Video Tutorial</h3>
                <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
                  <iframe
                    src={getYouTubeUrl(recipe.strYoutube)}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    title={`How to make ${recipe.strMeal}`}
                  />
                </div>
              </div>
            )}

            {recipe.strSource && (
              <a
                href={recipe.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                View Original Recipe
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Discover Amazing Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search through thousands of delicious recipes or get inspired with random suggestions
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.strCategory} value={category.strCategory}>
                    {category.strCategory}
                  </option>
                ))}
              </select>
              <button
                onClick={getRandomRecipes}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                <span className="hidden sm:inline">Get Random</span> Recipes
              </button>
            </div>
            
            <form onSubmit={searchRecipes} className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for recipes..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Searching...
                  </span>
                ) : (
                  'Search'
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>

        {/* Recipe Grid */}
        {loading && !recipes.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Finding delicious recipes...</p>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map(recipe => (
              <div 
                key={recipe.idMeal}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white">
                    {recipe.strMeal}
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {recipe.strCategory}
                    </span>
                    {recipe.strArea && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {recipe.strArea}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-xl text-gray-600">
                {searchQuery ? 'No recipes found' : 'Search for recipes or click "Random Recipes" to get started'}
              </p>
            </div>
          </div>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </div>
  )
}

export default RecipeExplorer 