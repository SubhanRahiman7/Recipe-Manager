import React, { createContext, useContext, useState, useEffect } from 'react'

const PlannerContext = createContext()

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
export const MEALS = ['breakfast', 'lunch', 'dinner']

const MEAL_PLAN_KEY = 'mealPlan'
const SHOPPING_LIST_KEY = 'shoppingList'

// Helper function to normalize ingredient names
const normalizeIngredient = (ingredient) => {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\([^)]*\)/g, '') // Remove parentheses and their contents
}

export const usePlanner = () => {
  const context = useContext(PlannerContext)
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider')
  }
  return context
}

export const PlannerProvider = ({ children }) => {
  // Initialize mealPlan from localStorage
  const [mealPlan, setMealPlan] = useState(() => {
    try {
      const savedPlan = localStorage.getItem(MEAL_PLAN_KEY)
      return savedPlan ? JSON.parse(savedPlan) : {}
    } catch (error) {
      console.error('Error loading meal plan:', error)
      return {}
    }
  })

  // Initialize shoppingList from localStorage
  const [shoppingList, setShoppingList] = useState(() => {
    try {
      const savedList = localStorage.getItem(SHOPPING_LIST_KEY)
      return savedList ? JSON.parse(savedList) : {}
    } catch (error) {
      console.error('Error loading shopping list:', error)
      return {}
    }
  })

  // Save meal plan to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(mealPlan))
    } catch (error) {
      console.error('Error saving meal plan:', error)
    }
  }, [mealPlan])

  // Save shopping list to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(shoppingList))
    } catch (error) {
      console.error('Error saving shopping list:', error)
    }
  }, [shoppingList])

  const addMealToDay = (day, mealType, meal) => {
    setMealPlan(prev => {
      const newPlan = { ...prev }
      if (!newPlan[day]) {
        newPlan[day] = {}
      }
      if (typeof meal === 'string') {
        newPlan[day][mealType] = {
          strMeal: meal,
          isCustom: true,
          strCategory: 'Custom',
          strInstructions: '',
          strMealThumb: '/placeholder-meal.jpg'
        }
      } else {
        newPlan[day][mealType] = meal
      }
      return newPlan
    })
  }

  const removeMealFromDay = (day, mealType) => {
    setMealPlan(prev => {
      const newPlan = { ...prev }
      if (newPlan[day] && newPlan[day][mealType]) {
        delete newPlan[day][mealType]
        if (Object.keys(newPlan[day]).length === 0) {
          delete newPlan[day]
        }
      }
      return newPlan
    })
  }

  const clearMealPlan = () => {
    setMealPlan({})
    setShoppingList({}) // Clear shopping list when meal plan is cleared
    // Clear from localStorage
    localStorage.removeItem(MEAL_PLAN_KEY)
    localStorage.removeItem(SHOPPING_LIST_KEY)
  }

  const getShoppingList = () => {
    const ingredients = { ...shoppingList } // Start with manually added items
    
    // Add ingredients from meal plan
    if (mealPlan && Object.keys(mealPlan).length > 0) {
      Object.values(mealPlan).forEach(dayMeals => {
        if (!dayMeals) return
        
        Object.values(dayMeals).forEach(meal => {
          if (!meal || meal.isCustom) return
          
          for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`]
            const measure = meal[`strMeasure${i}`]
            
            if (ingredient && ingredient.trim()) {
              const normalizedIngredient = normalizeIngredient(ingredient)
              if (!ingredients[normalizedIngredient]) {
                ingredients[normalizedIngredient] = []
              }
              if (measure && measure.trim() && !ingredients[normalizedIngredient].includes(measure.trim())) {
                ingredients[normalizedIngredient].push(measure.trim())
              }
            }
          }
        })
      })
    }

    // Convert to final format with capitalized keys
    return Object.fromEntries(
      Object.entries(ingredients).map(([ingredient, measures]) => [
        ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
        measures
      ])
    )
  }

  const addToShoppingList = (ingredient, measure = '') => {
    const normalizedIngredient = normalizeIngredient(ingredient)
    setShoppingList(prev => {
      const newList = { ...prev }
      if (!newList[normalizedIngredient]) {
        newList[normalizedIngredient] = []
      }
      if (measure && !newList[normalizedIngredient].includes(measure)) {
        newList[normalizedIngredient].push(measure)
      }
      // Immediately save to localStorage
      try {
        localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(newList))
      } catch (error) {
        console.error('Error saving shopping list:', error)
      }
      return newList
    })
  }

  const removeFromShoppingList = (ingredient) => {
    const normalizedIngredient = normalizeIngredient(ingredient)
    setShoppingList(prev => {
      const newList = { ...prev }
      delete newList[normalizedIngredient]
      // Immediately save to localStorage
      try {
        localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(newList))
      } catch (error) {
        console.error('Error saving shopping list:', error)
      }
      return newList
    })
  }

  const value = {
    mealPlan,
    addMealToDay,
    removeMealFromDay,
    getShoppingList,
    clearMealPlan,
    addToShoppingList,
    removeFromShoppingList,
    MEALS,
    DAYS
  }

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  )
} 