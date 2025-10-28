// src/components/Header.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, role, signInBuyer, signInSeller, signOutAll } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg hover:bg-gray-100 ${
        loc.pathname === to ? 'font-semibold text-slate-900' : 'text-slate-600'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" className="h-7 w-7 rounded" alt="logo" />
          <span className="font-semibold">Picsellart</span>
        </Link>

        <nav className="ml-6 hidden md:flex items-center gap-1">
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/refund">Refunds</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {!user && (
            <>
              <button
                onClick={async () => {
                  await signInBuyer();
                }}
                className="px-4 py-2 rounded-full border text-slate-700 hover:bg-gray-50"
              >
                Buyer Login
              </button>

              <button
                onClick={async () => {
                  const u = await signInSeller();
                  // after seller login, check plan page handles redirect but navigate to dashboard as default
                  navigate('/seller/dashboard');
                }}
                className="px-4 py-2 rounded-full border text-slate-700 hover:bg-gray-50"
              >
                Seller Login
              </button>

              <Link
                to="/explore"
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Explore
              </Link>
            </>
          )}

          {user && role === 'buyer' && (
            <>
              <Link
                to="/buyer"
                className="px-4 py-2 rounded-full border text-slate-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <button
                onClick={signOutAll}
                className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          )}

          {user && role === 'seller' && (
            <>
              <Link
                to="/seller/dashboard"
                className="px-4 py-2 rounded-full border text-slate-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <button
                onClick={signOutAll}
                className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
