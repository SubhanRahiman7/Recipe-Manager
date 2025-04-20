import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
          Explore Recipes
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover delicious recipes from around the world. Search by name or ingredients to find your next favorite meal.
        </p>
      </div>

      <form onSubmit={searchRecipes} className="max-w-2xl mx-auto mb-12 animate-slide-in">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for recipes..."
            className="input-primary flex-1 text-lg"
          />
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="button-primary flex items-center px-6"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="max-w-2xl mx-auto mb-12 flex justify-center">
        <button
          onClick={getRandomRecipes}
          disabled={loading}
          className="button-secondary flex items-center px-6 py-3 transform hover:scale-105 transition-all duration-300"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          )}
          {loading ? 'Loading...' : 'Surprise Me!'}
        </button>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      <div className="card-grid">
        {recipes.map((recipe, index) => (
          <Link
            key={recipe.idMeal}
            to={`/recipes/${recipe.idMeal}`}
            className="hover-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative group">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{recipe.strMeal}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{recipe.strCategory}</span>
                <span className="text-sm text-gray-500">{recipe.strArea}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recipes.length === 0 && searchQuery && !loading && (
        <div className="text-center py-12 animate-fade-in">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No recipes found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search terms or explore different ingredients.</p>
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
  )
}

export default RecipeExplorer 