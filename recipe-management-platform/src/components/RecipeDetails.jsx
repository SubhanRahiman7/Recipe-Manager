const RecipeDetails = ({ isOpen, onClose, recipe }) => {
  if (!recipe || !isOpen) return null

  // Get all ingredients and measurements
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]
    const measure = recipe[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure: measure || 'To taste' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{recipe.strMeal}</h2>
              <span className="inline-block px-2 py-1 text-sm font-medium text-teal-700 bg-teal-100 rounded">
                {recipe.strCategory}
              </span>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Image and Ingredients */}
              <div className="space-y-6">
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="w-full rounded-lg shadow-md"
                />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                  <ul className="space-y-2">
                    {ingredients.map(({ ingredient, measure }, index) => (
                      <li key={index} className="flex items-center">
                        <span className="font-medium">{ingredient}</span>
                        <span className="mx-2">-</span>
                        <span className="text-gray-600">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right column - Instructions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                  <p className="whitespace-pre-wrap text-gray-700">
                    {recipe.strInstructions}
                  </p>
                </div>

                {recipe.strYoutube && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Video Tutorial</h3>
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                )}

                {recipe.strSource && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Source</h3>
                    <a
                      href={recipe.strSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Original Recipe
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

export default RecipeDetails 