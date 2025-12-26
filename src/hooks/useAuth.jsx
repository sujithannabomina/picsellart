import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const AuthContext = createContext(null);

const ROLE_KEY = "picsellart_role"; // "buyer" | "seller"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  async function signInWithGoogleAs(role) {
    try {
      localStorage.setItem(ROLE_KEY, role);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const res = await signInWithPopup(auth, provider);
      return res.user;
    } catch (err) {
      // pass error upward so UI can show it
      throw err;
    }
  }

  async function logout() {
    await signOut(auth);
  }

  function getRole() {
    return localStorage.getItem(ROLE_KEY) || "buyer";
  }

  const value = useMemo(
    () => ({
      user,
      authLoading,
      signInBuyer: () => signInWithGoogleAs("buyer"),
      signInSeller: () => signInWithGoogleAs("seller"),
      logout,
      getRole,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // This prevents silent null context issues
    throw new Error("useAuth() must be used inside <AuthProvider>.");
  }
  return ctx;
}
