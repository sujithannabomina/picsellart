// ═══════════════════════════════════════════════════════════════════════════
// FILE PATH: src/routes/SellerRoute.jsx
// ═══════════════════════════════════════════════════════════════════════════
// ✅ CORRECTED: Checks if user is an ACTIVE seller before allowing access
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function SellerRoute({ children }) {
  const { user, booting } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isActiveSeller, setIsActiveSeller] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSellerStatus() {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const sellerRef = doc(db, "sellers", user.uid);
        const sellerSnap = await getDoc(sellerRef);

        if (cancelled) return;

        if (sellerSnap.exists()) {
          const sellerData = sellerSnap.data();
          
          // Only allow access if seller is ACTIVE
          if (sellerData.status === "active") {
            setIsActiveSeller(true);
          } else {
            setIsActiveSeller(false);
          }
        } else {
          setIsActiveSeller(false);
        }
      } catch (error) {
        console.error("Error checking seller status:", error);
        setIsActiveSeller(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkSellerStatus();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Show nothing while checking
  if (booting || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // Not logged in → Redirect to seller login
  if (!user) {
    return <Navigate to="/seller-login" replace />;
  }

  // Logged in but not an active seller → Redirect to onboarding
  if (!isActiveSeller) {
    return <Navigate to="/seller-onboarding" replace />;
  }

  // Active seller → Allow access
  return children;
}