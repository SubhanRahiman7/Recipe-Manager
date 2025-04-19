const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

export const api = {
  // Search recipes by name
  searchRecipes: async (query) => {
    try {
      const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
      const data = await response.json()
      return data.meals || []
    } catch (error) {
      console.error('Error searching recipes:', error)
      return []
    }
  },

  // Get recipe details by ID
  getRecipeById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
      const data = await response.json()
      return data.meals?.[0] || null
    } catch (error) {
      console.error('Error fetching recipe:', error)
      return null
    }
  }
}