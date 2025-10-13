// src/components/Header.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, role, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();

  const onLogout = async () => {
    await logout();
    nav('/'); // back to home
  };

  const active = (p) =>
    pathname === p ? 'bg-neutral-900 text-white px-4 py-2 rounded-lg' : 'px-4 py-2 rounded-lg';

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-64.png" alt="Picsellart" className="h-7 w-7 object-contain" />
          <span className="text-xl font-semibold">Picsellart</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Link className={active('/')} to="/">Home</Link>
          <Link className={active('/explore')} to="/explore">Explore</Link>
          <Link className={active('/faq')} to="/faq">FAQ</Link>
          <Link className={active('/refund')} to="/refund">Refund</Link>
          <Link className={active('/contact')} to="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/buyer/login" className="btn btn-dark">Buyer Login</Link>
              <Link to="/seller/login" className="btn btn-primary">Seller Login</Link>
            </>
          )}

          {user && role === 'buyer' && (
            <>
              <Link to="/buyer/dashboard" className="btn btn-dark">Buyer Dashboard</Link>
              <button onClick={onLogout} className="btn btn-outline">Logout</button>
            </>
          )}

          {user && role === 'seller' && (
            <>
              <Link to="/seller/dashboard" className="btn btn-dark">Seller Dashboard</Link>
              <button onClick={onLogout} className="btn btn-outline">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
