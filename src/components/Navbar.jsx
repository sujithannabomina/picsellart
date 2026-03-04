// ═══════════════════════════════════════════════════════════════════════════
// FILE PATH: src/components/Navbar.jsx
// ✅ FIXED: Proper seller onboarding flow - no buyer dashboard shown during seller flow
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isActiveSeller, setIsActiveSeller] = useState(false);
  const [isPendingSeller, setIsPendingSeller] = useState(false);
  const [checkingSeller, setCheckingSeller] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isSellerFlow = ["/seller-onboarding", "/seller-login"].includes(location.pathname);

  useEffect(() => {
    if (!user) {
      setIsActiveSeller(false);
      setIsPendingSeller(false);
      setCheckingSeller(false);
      return;
    }

    let cancelled = false;
    setCheckingSeller(true);

    async function checkSellerStatus() {
      try {
        const sellerRef = doc(db, "sellers", user.uid);
        const sellerSnap = await getDoc(sellerRef);
        if (cancelled) return;
        if (sellerSnap.exists()) {
          const d = sellerSnap.data();
          setIsActiveSeller(d.status === "active");
          setIsPendingSeller(d.status === "pending_profile");
        } else {
          setIsActiveSeller(false);
          setIsPendingSeller(false);
        }
      } catch (error) {
        if (!cancelled) { setIsActiveSeller(false); setIsPendingSeller(false); }
      } finally {
        if (!cancelled) setCheckingSeller(false);
      }
    }

    checkSellerStatus();
    return () => { cancelled = true; };
  }, [user, location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const renderAuthButtons = () => {
    if (!user) {
      return (
        <>
          <Link to="/buyer-login" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">Buyer Login</Link>
          <Link to="/seller-login" className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700">Seller Login</Link>
        </>
      );
    }
    if (checkingSeller) return <div className="text-sm text-slate-500">Loading...</div>;
    if (isActiveSeller) {
      return (
        <>
          <Link to="/seller-dashboard" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Seller Dashboard</Link>
          <button onClick={handleLogout} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Logout</button>
        </>
      );
    }
    if (isPendingSeller) {
      return (
        <>
          <Link to="/seller-onboarding" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Complete Profile</Link>
          <button onClick={handleLogout} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Logout</button>
        </>
      );
    }
    if (isSellerFlow) {
      return (
        <button onClick={handleLogout} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Logout</button>
      );
    }
    return (
      <>
        <Link to="/buyer-dashboard" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Buyer Dashboard</Link>
        <Link to="/seller-login" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Seller Login</Link>
        <button onClick={handleLogout} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Logout</button>
      </>
    );
  };

  const renderMobileAuthButtons = () => {
    if (!user) {
      return (
        <>
          <Link to="/buyer-login" className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">Buyer</Link>
          <Link to="/seller-login" className="rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white">Seller</Link>
        </>
      );
    }
    if (isActiveSeller) return <Link to="/seller-dashboard" className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">Dashboard</Link>;
    if (isPendingSeller) return <Link to="/seller-onboarding" className="rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white">Complete Profile</Link>;
    if (isSellerFlow) return null;
    return <Link to="/buyer-dashboard" className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">Dashboard</Link>;
  };

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="PicSellArt" className="h-8 w-8 rounded-xl object-contain bg-white" loading="eager" />
            <span className="text-lg font-bold text-slate-900">PicSellArt</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">Home</Link>
            <Link to="/explore" className="text-sm font-medium text-slate-700 hover:text-slate-900">Explore</Link>
            <Link to="/faq" className="text-sm font-medium text-slate-700 hover:text-slate-900">FAQ</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-700 hover:text-slate-900">Contact</Link>
            <Link to="/refunds" className="text-sm font-medium text-slate-700 hover:text-slate-900">Refunds</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">{renderAuthButtons()}</div>

          <div className="flex md:hidden items-center gap-2">
            {renderMobileAuthButtons()}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 flex flex-col gap-2">
            <Link to="/" className="px-2 py-2 text-sm font-medium text-slate-700">Home</Link>
            <Link to="/explore" className="px-2 py-2 text-sm font-medium text-slate-700">Explore</Link>
            <Link to="/faq" className="px-2 py-2 text-sm font-medium text-slate-700">FAQ</Link>
            <Link to="/contact" className="px-2 py-2 text-sm font-medium text-slate-700">Contact</Link>
            <Link to="/refunds" className="px-2 py-2 text-sm font-medium text-slate-700">Refunds</Link>
            {user && <button onClick={handleLogout} className="px-2 py-2 text-sm font-medium text-red-600 text-left">Logout</button>}
          </div>
        )}
      </div>
    </nav>
  );
}