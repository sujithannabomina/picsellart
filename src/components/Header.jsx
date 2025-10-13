import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md ${active ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
    >
      {children}
    </Link>
  )
}

export default function Header() {
  const { user, role, logout } = useAuth()
  const nav = useNavigate()

  const goDash = () => {
    if (role === 'seller') nav('/seller/dashboard')
    else nav('/buyer/dashboard')
  }

  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-64.png" alt="Picsellart" className="h-7 w-7 rounded" />
          <span className="font-semibold text-lg">Picsellart</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/refund">Refund</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {!user && (
            <>
              <Link to="/buyer/login" className="px-4 py-2 rounded-md bg-black text-white">
                Buyer Login
              </Link>
              <Link to="/seller/login" className="px-4 py-2 rounded-md bg-indigo-600 text-white">
                Seller Login
              </Link>
            </>
          )}

          {user && (
            <>
              <button
                onClick={goDash}
                className="px-4 py-2 rounded-md bg-black text-white"
              >
                {role === 'seller' ? 'Seller Dashboard' : 'Buyer Dashboard'}
              </button>
              <button
                onClick={async () => {
                  await logout()
                  nav('/')
                }}
                className="px-4 py-2 rounded-md border"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
