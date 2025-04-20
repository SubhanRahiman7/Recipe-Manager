import React, { createContext, useContext, useState } from 'react'

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
      if (savedPlan) {
        return JSON.parse(savedPlan)
      }
      // Initialize with breakfast on Tuesday
      return {
        tuesday: {
          breakfast: {
            strMeal: "Breakfast",
            isCustom: true,
            strCategory: "Custom",
            strInstructions: "",
            strMealThumb: "/placeholder-meal.jpg"
          }
        }
      }
    } catch (error) {
      console.error('Error loading meal plan:', error)
      return {}
    }
  })

  // Initialize shopping list from localStorage
  const [shoppingList, setShoppingList] = useState(() => {
    try {
      const savedList = localStorage.getItem(SHOPPING_LIST_KEY)
      return savedList ? JSON.parse(savedList) : {}
    } catch (error) {
      console.error('Error loading shopping list:', error)
      return {}
    }
  })

  const addMealToDay = (day, mealType, meal) => {
    const newPlan = { ...mealPlan }
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
    setMealPlan(newPlan)
    localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(newPlan))
  }

  const removeMealFromDay = (day, mealType) => {
    const newPlan = { ...mealPlan }
    if (newPlan[day] && newPlan[day][mealType]) {
      delete newPlan[day][mealType]
      if (Object.keys(newPlan[day]).length === 0) {
        delete newPlan[day]
      }
    }
    setMealPlan(newPlan)
    localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(newPlan))
  }

  const clearMealPlan = () => {
    setMealPlan({})
    setShoppingList({})
    localStorage.removeItem(MEAL_PLAN_KEY)
    localStorage.removeItem(SHOPPING_LIST_KEY)
  }

  const addToShoppingList = (ingredient, measure = '') => {
    const normalizedIngredient = normalizeIngredient(ingredient)
    const newList = { ...shoppingList }
    
    // Initialize array if ingredient doesn't exist
    if (!newList[normalizedIngredient]) {
      newList[normalizedIngredient] = []
    }
    
    // Add measure if it's not already in the list
    if (measure && measure.trim() && !newList[normalizedIngredient].includes(measure.trim())) {
      newList[normalizedIngredient].push(measure.trim())
    }
    
    setShoppingList(newList)
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(newList))
  }

  const addMultipleToShoppingList = (ingredients) => {
    const newList = { ...shoppingList }
    
    ingredients.forEach(({ ingredient, measure = '' }) => {
      const normalizedIngredient = normalizeIngredient(ingredient)
      
      // Initialize array if ingredient doesn't exist
      if (!newList[normalizedIngredient]) {
        newList[normalizedIngredient] = []
      }
      
      // Add measure if it's not already in the list
      if (measure && measure.trim() && !newList[normalizedIngredient].includes(measure.trim())) {
        newList[normalizedIngredient].push(measure.trim())
      }
    })
    
    setShoppingList(newList)
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(newList))
  }

  const removeFromShoppingList = (ingredient) => {
    try {
      const normalizedIngredient = normalizeIngredient(ingredient);
      const newList = { ...shoppingList };
      
      // Delete the ingredient
      delete newList[normalizedIngredient];
      
      // Update state first
      setShoppingList(newList);
      
      // Then update localStorage
      localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(newList));
      
      return true; // Return success status
    } catch (error) {
      console.error('Error removing item from shopping list:', error);
      return false; // Return failure status
    }
  };

  const getShoppingList = () => {
    const list = { ...shoppingList }
    
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
              if (!list[normalizedIngredient]) {
                list[normalizedIngredient] = []
              }
              if (measure && measure.trim() && !list[normalizedIngredient].includes(measure.trim())) {
                list[normalizedIngredient].push(measure.trim())
              }
            }
          }
        })
      })
    }

    // Convert to final format with capitalized keys
    return Object.fromEntries(
      Object.entries(list).map(([ingredient, measures]) => [
        ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
        measures
      ])
    )
  }

  const value = {
    mealPlan,
    shoppingList,
    addMealToDay,
    removeMealFromDay,
    getShoppingList,
    clearMealPlan,
    addToShoppingList,
    addMultipleToShoppingList,
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