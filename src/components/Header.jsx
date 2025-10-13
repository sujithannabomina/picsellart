import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, role, loading, logout } = useAuth()
  const nav = useNavigate()
  const { pathname } = useLocation()

  // Helper: show “active” pill
  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md ${pathname === to ? 'bg-black text-white' : 'hover:bg-black/5'}`}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo192.png" alt="Picsellart" className="h-7 w-7 object-contain" />
          <span className="text-xl font-semibold">Picsellart</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" label="Home" />
          <NavLink to="/explore" label="Explore" />
          <NavLink to="/faq" label="FAQ" />
          <NavLink to="/refund" label="Refund" />
          <NavLink to="/contact" label="Contact" />
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-28 animate-pulse rounded-md bg-black/10" />
          ) : user ? (
            <>
              {/* Buyer / Seller dashboard buttons based on role */}
              {role === 'buyer' && (
                <button
                  onClick={() => nav('/buyer/dashboard')}
                  className="px-4 py-2 rounded-md bg-black text-white"
                >
                  Buyer Dashboard
                </button>
              )}
              {role === 'seller' && (
                <button
                  onClick={() => nav('/seller/dashboard')}
                  className="px-4 py-2 rounded-md bg-black text-white"
                >
                  Seller Dashboard
                </button>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md hover:bg-black/5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => nav('/buyer/login')}
                className="px-4 py-2 rounded-md bg-black text-white"
              >
                Buyer Login
              </button>
              <button
                onClick={() => nav('/seller/login')}
                className="px-4 py-2 rounded-md hover:bg-black/5"
              >
                Seller Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
