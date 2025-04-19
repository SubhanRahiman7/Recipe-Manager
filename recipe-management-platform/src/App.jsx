import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { PlannerProvider } from './context/PlannerContext'
import MealPlanner from './pages/MealPlanner'
import RecipeExplorer from './pages/RecipeExplorer'
import ShoppingList from './pages/ShoppingList'

function App() {
  return (
    <Router>
      <PlannerProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-bold text-gray-800">Recipe Manager</h1>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      to="/recipes"
                      className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                    >
                      Explore Recipes
                    </Link>
                    <Link
                      to="/planner"
                      className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                    >
                      Meal Planner
                    </Link>
                    <Link
                      to="/shopping-list"
                      className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                    >
                      Shopping List
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<RecipeExplorer />} />
              <Route path="/recipes" element={<RecipeExplorer />} />
              <Route path="/planner" element={<MealPlanner />} />
              <Route path="/shopping-list" element={<ShoppingList />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white shadow-inner mt-8">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Recipe Manager. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </PlannerProvider>
    </Router>
  )
}

export default App