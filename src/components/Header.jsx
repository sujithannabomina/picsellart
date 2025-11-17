import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO LEFT */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-md"></div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            Picsellart
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-6 text-gray-700">
          <NavLink to="/explore" className="hover:text-black">Explore</NavLink>
          <NavLink to="/faq" className="hover:text-black">FAQ</NavLink>
          <NavLink to="/contact" className="hover:text-black">Contact</NavLink>
          <NavLink to="/refunds" className="hover:text-black">Refunds</NavLink>
        </nav>

        {/* BUTTONS RIGHT */}
        <div className="flex items-center gap-3">
          <Link
            to="/buyer-login"
            className="px-4 py-2 rounded-full border text-sm hover:bg-gray-100"
          >
            Buyer Login
          </Link>

          <Link
            to="/seller-login"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm shadow-md hover:opacity-90"
          >
            Seller Login
          </Link>
        </div>
      </div>
    </header>
  );
}
