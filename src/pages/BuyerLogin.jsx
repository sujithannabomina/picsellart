import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerLogin() {
  const { googleLogin, ensureBuyerProfile } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onLogin = async () => {
    setErr("");
    setBusy(true);
    try {
      const u = await googleLogin();
      await ensureBuyerProfile(u);
      nav("/buyer-dashboard", { replace: true });
    } catch (e) {
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-xl px-4 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Buyer Login</h1>
        <p className="mt-2 text-slate-600">Sign in with Google to explore and purchase.</p>

        {err ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>
        ) : null}

        <button
          onClick={onLogin}
          disabled={busy}
          className="mt-8 w-full rounded-2xl bg-black px-5 py-3 text-white hover:bg-slate-900 disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Continue with Google"}
        </button>

        <div className="mt-6 text-sm text-slate-600">
          Want to sell?{" "}
          <Link className="underline" to="/seller-login">
            Seller Login
          </Link>
        </div>
      </div>
    </div>
  );
}

        `px-3 py-2 rounded-xl text-sm ${
          isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="PicSellArt"
              className="h-9 w-9 rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="font-semibold tracking-tight text-slate-900">PicSellArt</div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/explore">Explore</NavItem>
            <NavItem to="/faq">FAQ</NavItem>
            <NavItem to="/contact">Contact</NavItem>
            <NavItem to="/refunds">Refunds</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link
                  to="/buyer-login"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400"
                >
                  Buyer Login
                </Link>
                <Link
                  to="/seller-login"
                  className="rounded-2xl bg-black px-4 py-2 text-sm text-white hover:bg-slate-900"
                >
                  Seller Login
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => nav("/buyer-dashboard")}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="rounded-2xl bg-black px-4 py-2 text-sm text-white hover:bg-slate-900"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
