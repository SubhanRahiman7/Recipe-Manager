import { Link as RouterLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-teal-500 px-4 text-white">
      <div className="h-16 flex items-center justify-between max-w-7xl mx-auto">
        <RouterLink to="/" className="text-xl font-bold hover:text-teal-100">
          Recipe Manager
        </RouterLink>
        <div className="flex gap-6">
          <RouterLink to="/recipes" className="hover:text-teal-100 transition-colors">
            Recipes
          </RouterLink>
          <RouterLink to="/planner" className="hover:text-teal-100 transition-colors">
            Meal Planner
          </RouterLink>
          <RouterLink to="/shopping-list" className="hover:text-teal-100 transition-colors">
            Shopping List
          </RouterLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar