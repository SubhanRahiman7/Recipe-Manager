import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Recipes from './pages/Recipes.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import MealPlanner from './pages/MealPlanner.jsx'
import ShoppingList from './pages/ShoppingList.jsx'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
      <Route path="/planner" element={<MealPlanner />} />
      <Route path="/shopping-list" element={<ShoppingList />} />
    </Routes>
  )
}

export default AppRoutes