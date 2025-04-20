import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { PlannerProvider } from './context/PlannerContext'
import MealPlanner from './pages/MealPlanner'
import RecipeExplorer from './pages/RecipeExplorer'
import RecipeDetail from './pages/RecipeDetail'
import ShoppingList from './pages/ShoppingList'
import ErrorBoundary from './components/ErrorBoundary'

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`relative px-3 py-2 transition-all duration-300 ease-in-out group ${
        isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      <span className="relative z-10">{children}</span>
      <span className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-300 ease-in-out ${
        isActive ? 'bg-blue-600' : 'bg-transparent group-hover:bg-blue-200'
      }`}></span>
    </Link>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <PlannerProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-filter backdrop-blur-lg bg-opacity-90">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
                        Recipe Manager
                      </h1>
                    </div>
                    <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                      <NavLink to="/recipes">
                        <div className="flex items-center space-x-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                          </svg>
                          <span>Explore Recipes</span>
                        </div>
                      </NavLink>
                      <NavLink to="/planner">
                        <div className="flex items-center space-x-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Meal Planner</span>
                        </div>
                      </NavLink>
                      <NavLink to="/shopping-list">
                        <div className="flex items-center space-x-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Shopping List</span>
                        </div>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 animate-fade-in">
              <Routes>
                <Route path="/" element={<RecipeExplorer />} />
                <Route path="/recipes" element={<RecipeExplorer />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/planner" element={<MealPlanner />} />
                <Route path="/shopping-list" element={<ShoppingList />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-white bg-opacity-90 shadow-inner mt-8">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                      About
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                      Contact
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                      Privacy
                    </a>
                  </div>
                  <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Recipe Manager. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </PlannerProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App