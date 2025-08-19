import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, profile, logout } = useAuth()
  const link = 'px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100'
  const active = 'bg-gray-900 text-white hover:bg-gray-900'

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Picsellart logo" className="h-8 w-8 rounded" />
          <span className="text-xl font-bold tracking-tight">Picsellart</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={({isActive})=>`${link} ${isActive?active:''}`}>Home</NavLink>
          <NavLink to="/explore" className={({isActive})=>`${link} ${isActive?active:''}`}>Explore</NavLink>
          <NavLink to="/faq" className={({isActive})=>`${link} ${isActive?active:''}`}>FAQ</NavLink>
          <NavLink to="/refund" className={({isActive})=>`${link} ${isActive?active:''}`}>Refund</NavLink>
          <NavLink to="/contact" className={({isActive})=>`${link} ${isActive?active:''}`}>Contact</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          {!user && (
            <>
              <Link to="/buyer/login" className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm">Buyer Login</Link>
              <Link to="/seller/login" className="px-3 py-2 rounded-lg border text-sm">Seller Login</Link>
            </>
          )}
          {user && (
            <>
              {profile?.role === 'buyer' && <Link to="/buyer/dashboard" className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm">Buyer Dashboard</Link>}
              {profile?.role === 'seller' && <Link to="/seller/dashboard" className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm">Seller Dashboard</Link>}
              <button onClick={logout} className="px-3 py-2 rounded-lg border text-sm">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
