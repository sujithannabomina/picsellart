import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * Sticky navigation bar.
 * - Sticks to top on mobile and desktop
 * - Simple hamburger menu on small screens
 * - Add your actual logo file at /public/logo.png (optional)
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    "px-3 py-2 rounded-md text-sm font-medium " +
    (isActive ? "text-blue-600" : "text-gray-700 hover:text-gray-900");

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b h-[64px]">
      <nav className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo + brand */}
        <Link to="/" className="flex items-center gap-3">
          {/* Put /public/logo.png if you have one */}
          <img
            src="/logo.png"
            alt="Picsellart"
            className="h-9 w-9 rounded"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="text-xl font-bold">Picsellart</span>
        </Link>

        {/* Right: Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/explore" className={navLinkClass}>
            Explore
          </NavLink>
          <NavLink to="/sell" className={navLinkClass}>
            Sell
          </NavLink>
          <NavLink to="/faq" className={navLinkClass}>
            FAQ
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md border"
          onClick={() => setOpen((s) => !s)}
          aria-label="Menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 flex flex-col">
            <NavLink to="/" className={navLinkClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/explore" className={navLinkClass} onClick={() => setOpen(false)}>
              Explore
            </NavLink>
            <NavLink to="/sell" className={navLinkClass} onClick={() => setOpen(false)}>
              Sell
            </NavLink>
            <NavLink to="/faq" className={navLinkClass} onClick={() => setOpen(false)}>
              FAQ
            </NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setOpen(false)}>
              Contact
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
