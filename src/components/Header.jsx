import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '/logo192.png'

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link to={to} className={`px-3 py-2 rounded ${active ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}>{children}</Link>
  )
}

export default function Header() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const goDash = () => navigate(role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard')

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Picsellart" className="h-7 w-7" />
          <span className="font-semibold text-lg">Picsellart</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/refund">Refund</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/buyer/login" className="px-3 py-2 rounded bg-black text-white">Buyer Login</Link>
              <Link to="/seller/login" className="px-3 py-2 rounded bg-indigo-600 text-white">Seller Login</Link>
            </>
          ) : (
            <>
              <button onClick={goDash} className="px-3 py-2 rounded bg-black text-white">Dashboard</button>
              <button onClick={async () => { await logout(); navigate('/'); }} className="px-3 py-2 rounded border">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
