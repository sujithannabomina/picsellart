// src/hooks/useAuth.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase"; // must export `auth` from src/firebase.js

const AuthContext = createContext(null);

const ROLE_KEY = "picsellart_role";
const PLAN_KEY = "picsellart_seller_plan";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem(ROLE_KEY) || null);
  const [sellerPlan, setSellerPlan] = useState(localStorage.getItem(PLAN_KEY) || "starter");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const provider = useMemo(() => new GoogleAuthProvider(), []);

  const loginAsBuyer = async () => {
    const res = await signInWithPopup(auth, provider);
    localStorage.setItem(ROLE_KEY, "buyer");
    setRole("buyer");
    return res.user;
  };

  const loginAsSeller = async (planId = "starter") => {
    const res = await signInWithPopup(auth, provider);
    localStorage.setItem(ROLE_KEY, "seller");
    localStorage.setItem(PLAN_KEY, planId);
    setRole("seller");
    setSellerPlan(planId);
    return res.user;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem(ROLE_KEY);
    // keep plan saved (optional). If you want to clear it too, uncomment:
    // localStorage.removeItem(PLAN_KEY);
    setRole(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      role,
      sellerPlan,
      setSellerPlan: (planId) => {
        localStorage.setItem(PLAN_KEY, planId);
        setSellerPlan(planId);
      },
      loading,
      loginAsBuyer,
      loginAsSeller,
      logout,
      isBuyer: role === "buyer",
      isSeller: role === "seller",
    }),
    [user, role, sellerPlan, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  // IMPORTANT: return a safe object (never null) to prevent destructure crashes
  return ctx || { user: null, role: null, sellerPlan: "starter", loading: false };
}
