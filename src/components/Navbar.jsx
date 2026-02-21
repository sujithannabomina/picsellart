// ═══════════════════════════════════════════════════════════════════════════
// FILE PATH: src/components/Navbar.jsx
// ═══════════════════════════════════════════════════════════════════════════
// ✅ EXACT REQUIREMENTS:
// Not logged in → [Buyer Login] [Seller Login]
// Logged in as Seller → [Seller Dashboard] [Buyer Login] [Logout]
// Logged in as Buyer → [Buyer Dashboard] [Seller Login] [Logout]
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [isActiveSeller, setIsActiveSeller] = useState(false);
  const [checkingSeller, setCheckingSeller] = useState(true);

  // Check if current user is an active seller
  useEffect(() => {
    let cancelled = false;

    async function checkSellerStatus() {
      if (!user) {
        setIsActiveSeller(false);
        setCheckingSeller(false);
        return;
      }

      try {
        const sellerRef = doc(db, "sellers", user.uid);
        const sellerSnap = await getDoc(sellerRef);

        if (cancelled) return;

        if (sellerSnap.exists()) {
          const sellerData = sellerSnap.data();
          setIsActiveSeller(sellerData.status === "active");
        } else {
          setIsActiveSeller(false);
        }
      } catch (error) {
        console.error("Error checking seller status:", error);
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

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <span className="text-lg font-bold text-white">P</span>
            </div>
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
              // CASE A: NOT LOGGED IN
              // Shows: [Buyer Login] [Seller Login]
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
            ) : !checkingSeller ? (
              // Logged in and finished checking seller status
              <>
                {isActiveSeller ? (
                  // ========================================
                  // CASE B: LOGGED IN AS SELLER
                  // Shows: [Seller Dashboard] [Buyer Login] [Logout]
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
                      onClick={logout}
                      className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // ========================================
                  // CASE C: LOGGED IN AS BUYER (not a seller)
                  // Shows: [Buyer Dashboard] [Seller Login] [Logout]
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
                      onClick={logout}
                      className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}