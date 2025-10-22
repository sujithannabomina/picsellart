import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navLinkBase =
  "px-3 py-2 rounded-xl text-[15px] transition hover:bg-[#eef1f6]";

const activeClass = ({ isActive }) =>
  (isActive ? "bg-[#eef1f6] " : "") + navLinkBase;

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#e2e8f0]">
      <div className="container flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          {/* If /public/logo.png exists it will show; otherwise text shows */}
          <img
            src="/logo.png"
            alt=""
            className="h-8 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-[20px] font-medium tracking-tight">
            Picsellart
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={activeClass} end>
            Home
          </NavLink>
          <NavLink to="/explore" className={activeClass}>
            Explore
          </NavLink>
          <NavLink to="/faq" className={activeClass}>
            FAQ
          </NavLink>
          <NavLink to="/refund" className={activeClass}>
            Refund
          </NavLink>
          <NavLink to="/contact" className={activeClass}>
            Contact
          </NavLink>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/buyer/login" className="btn btn-secondary">
            Buyer Login
          </Link>
          <Link to="/seller/login" className="btn btn-primary">
            Seller Login
          </Link>
        </div>

        {/* Mobile toggler */}
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-[#e2e8f0]"
          aria-label="Toggle menu"
          onClick={() => setOpen((p) => !p)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="#0f172a"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-[#e2e8f0] bg-white">
          <div className="container py-2 flex flex-col gap-1">
            <NavLink
              to="/"
              end
              className={activeClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/explore"
              className={activeClass}
              onClick={() => setOpen(false)}
            >
              Explore
            </NavLink>
            <NavLink
              to="/faq"
              className={activeClass}
              onClick={() => setOpen(false)}
            >
              FAQ
            </NavLink>
            <NavLink
              to="/refund"
              className={activeClass}
              onClick={() => setOpen(false)}
            >
              Refund
            </NavLink>
            <NavLink
              to="/contact"
              className={activeClass}
              onClick={() => setOpen(false)}
            >
              Contact
            </NavLink>

            <div className="flex gap-2 pt-2">
              <Link
                to="/buyer/login"
                className="btn btn-secondary w-full"
                onClick={() => setOpen(false)}
              >
                Buyer Login
              </Link>
              <Link
                to="/seller/login"
                className="btn btn-primary w-full"
                onClick={() => setOpen(false)}
              >
                Seller Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
