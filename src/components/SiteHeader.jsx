import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "rounded-xl px-3 py-2 text-sm font-medium transition",
          isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const items = useMemo(
    () => [
      { to: "/", label: "Home" },          // ✅ home button present (your request)
      { to: "/explore", label: "Explore" },
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact" },
      { to: "/refunds", label: "Refunds" },
    ],
    []
  );

  const closeMenu = () => setOpen(false);

  const handleBuyerClick = () => {
    closeMenu();
    if (user) navigate("/buyer-dashboard");
    else navigate("/buyer-login", { state: { next: location.pathname } });
  };

  const handleSellerClick = () => {
    closeMenu();
    navigate("/seller-login", { state: { next: location.pathname } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur">
      <div className="psa-container flex h-16 items-center justify-between gap-3">
        {/* Logo + brand (always visible) */}
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700 font-bold">
            P
          </div>
          <div className="text-sm font-semibold text-slate-900">PicSellArt</div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <NavItem key={it.to} to={it.to} label={it.label} />
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button className="psa-btn-primary" onClick={handleBuyerClick}>
            {user ? "Buyer Dashboard" : "Buyer Login"}
          </button>
          <button className="psa-btn-primary" onClick={handleSellerClick}>
            Seller Login
          </button>
          {user ? (
            <button
              className="psa-btn-soft"
              onClick={async () => {
                await logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          ) : null}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden psa-btn-soft"
          onClick={() => setOpen((s) => !s)}
          aria-label="Menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="psa-container flex flex-col gap-1 py-3">
            {items.map((it) => (
              <NavItem key={it.to} to={it.to} label={it.label} onClick={closeMenu} />
            ))}

            <div className="mt-2 flex flex-col gap-2">
              <button className="psa-btn-primary w-full" onClick={handleBuyerClick}>
                {user ? "Buyer Dashboard" : "Buyer Login"}
              </button>
              <button className="psa-btn-primary w-full" onClick={handleSellerClick}>
                Seller Login
              </button>
              {user ? (
                <button
                  className="psa-btn-soft w-full"
                  onClick={async () => {
                    await logout();
                    closeMenu();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
