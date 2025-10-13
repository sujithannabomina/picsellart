import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, role, logout } = useAuth()
  const loc = useLocation()
  const nav = useNavigate()

  const isActive = (path) => loc.pathname === path

  const onLogout = async () => {
    await logout()
    nav('/') // back home
  }

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-64.png" alt="Picsellart" className="h-7 w-7 rounded" />
          <span className="text-xl font-semibold">Picsellart</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link className={navCls(isActive('/'))} to="/">Home</Link>
          <Link className={navCls(isActive('/explore'))} to="/explore">Explore</Link>
          <Link className={navCls(isActive('/faq'))} to="/faq">FAQ</Link>
          <Link className={navCls(isActive('/refund'))} to="/refund">Refund</Link>
          <Link className={navCls(isActive('/contact'))} to="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          {!user && (
            <>
              <Link to="/buyer/login" className="btn">Buyer Login</Link>
              <Link to="/seller/login" className="btn-outline">Seller Login</Link>
            </>
          )}

          {user && (
            <>
              {role === 'seller' ? (
                <Link to="/seller/dashboard" className="btn">Seller Dashboard</Link>
              ) : (
                <Link to="/buyer/dashboard" className="btn">Buyer Dashboard</Link>
              )}
              <button onClick={onLogout} className="btn-outline">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function navCls(active) {
  return `px-3 py-1 rounded ${active ? 'bg-black text-white' : 'hover:bg-black/5'}`
}
