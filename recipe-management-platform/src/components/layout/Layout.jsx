import Navbar from './Navbar.jsx'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        {children}
      </main>
    </div>
  )
}

export default Layout