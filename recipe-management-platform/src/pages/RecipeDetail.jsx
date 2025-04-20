import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePlanner } from '../context/PlannerContext'

export default function RecipeDetail() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedToList, setAddedToList] = useState(false)
  const { addMultipleToShoppingList } = usePlanner()

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        )
        if (!response.ok) throw new Error('Failed to fetch recipe')
        const data = await response.json()
        if (data.meals) {
          setRecipe(data.meals[0])
        } else {
          setError('Recipe not found')
        }
      } catch (_) {
        setError('Failed to load recipe details')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
    setAddedToList(false) // Reset the added state when recipe changes
  }, [id])

  const getIngredients = () => {
    if (!recipe) return []
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`]
      const measure = recipe[`strMeasure${i}`]
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure: measure || '' })
      }
    }
    return ingredients
  }

  const addIngredientsToList = () => {
    const ingredients = getIngredients()
    if (ingredients.length > 0) {
      addMultipleToShoppingList(ingredients)
      setAddedToList(true)
      
      // Reset the added state after 2 seconds
      setTimeout(() => {
        setAddedToList(false)
      }, 2000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 animate-fade-in">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-700 mb-2">{error}</h2>
            <Link to="/recipes" className="text-blue-600 hover:text-blue-700 font-medium">
              Return to Recipe Explorer
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) return null

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/recipes"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Recipes
          </Link>
          <button
            onClick={addIngredientsToList}
            disabled={addedToList}
            className={`button-secondary flex items-center transition-all duration-300 ${
              addedToList ? 'bg-green-600 text-white' : ''
            }`}
          >
            {addedToList ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added to List!
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Shopping List
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden glass-effect">
          <div className="relative">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-4xl font-bold text-white mb-2">{recipe.strMeal}</h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                  {recipe.strCategory}
                </span>
                {recipe.strArea && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                    {recipe.strArea}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
                  Ingredients
                </h2>
                <ul className="space-y-2">
                  {getIngredients().map(({ ingredient, measure }, index) => (
                    <li
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="w-24 text-sm text-gray-600">{measure}</span>
                      <span className="flex-1">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
                  Instructions
                </h2>
                <div className="prose prose-blue max-w-none">
                  {recipe.strInstructions.split('\n').map((step, index) => (
                    step.trim() && (
                      <p
                        key={index}
                        className="mb-4 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {step}
                      </p>
                    )
                  ))}
                </div>

                {recipe.strYoutube && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
                      Video Tutorial
                    </h2>
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
  )
}