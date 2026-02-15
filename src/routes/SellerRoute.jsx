// src/routes/SellerRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function SellerRoute({ children }) {
  const { user, booting } = useAuth();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!user) return;
      const snap = await getDoc(doc(db, "sellers", user.uid));
      if (!cancelled) setAllowed(snap.exists());
    }
    run();
    return () => (cancelled = true);
  }, [user]);

  if (booting) return null;
  if (!user) return <Navigate to="/seller/login" replace />;
  if (allowed === null) return null;

  // Seller doc must exist to access seller-only pages
  if (!allowed) return <Navigate to="/seller/onboarding" replace />;

  return children;
}
