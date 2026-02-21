// ═══════════════════════════════════════════════════════════════════════════
// FILE PATH: src/components/Navbar.jsx
// ═══════════════════════════════════════════════════════════════════════════
// ✅ FIXED: Logo restored + Logout redirects to home page
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isActiveSeller, setIsActiveSeller] = useState(false);
  const [checkingSeller, setCheckingSeller] = useState(false);

  // Check if current user is an active seller
  useEffect(() => {
    if (!user) {
      setIsActiveSeller(false);
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
          const sellerData = sellerSnap.data();
          const isActive = sellerData.status === "active";
          setIsActiveSeller(isActive);
          console.log("🔍 Navbar: User is active seller:", isActive);
        } else {
          setIsActiveSeller(false);
          console.log("🔍 Navbar: No seller document found");
        }
      } catch (error) {
        console.error("❌ Navbar: Error checking seller status:", error);
        setIsActiveSeller(false);
      } finally {
        if (!cancelled) setCheckingSeller(false);
      }
    }

    checkSellerStatus();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // ✅ Logout handler that redirects to home
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* ✅ Logo - Using actual logo.png */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="PicSellArt"
              className="h-9 w-9 rounded-xl object-contain bg-white"
              loading="eager"
            />
            <span className="text-xl font-bold text-slate-900">PicSellArt</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Home
            </Link>
            <Link to="/explore" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Explore
            </Link>
            <Link to="/faq" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              FAQ
            </Link>
            <Link to="/contact" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Contact
            </Link>
            <Link to="/refunds" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Refunds
            </Link>
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="flex items-center gap-3">
            {!user ? (
              // ========================================
              // NOT LOGGED IN
              // [Buyer Login] [Seller Login]
              // ========================================
              <>
                <Link
                  to="/buyer-login"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buyer Login
                </Link>
                <Link
                  to="/seller-login"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Seller Login
                </Link>
              </>
            ) : checkingSeller ? (
              // Still checking seller status - show nothing
              <div className="text-sm text-slate-500">Loading...</div>
            ) : isActiveSeller ? (
              // ========================================
              // ACTIVE SELLER
              // [Seller Dashboard] [Buyer Login] [Logout]
              // ========================================
              <>
                <Link
                  to="/seller-dashboard"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Seller Dashboard
                </Link>
                <Link
                  to="/buyer-login"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buyer Login
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            ) : (
              // ========================================
              // BUYER (NOT A SELLER)
              // [Buyer Dashboard] [Seller Login] [Logout]
              // ========================================
              <>
                <Link
                  to="/buyer-dashboard"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Buyer Dashboard
                </Link>
                <Link
                  to="/seller-login"
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Seller Login
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}