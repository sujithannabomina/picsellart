// FILE: src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const AuthCtx = createContext(null);

const MODE_KEY = "psa_mode"; // "buyer" | "seller"

export function getMode() {
  return sessionStorage.getItem(MODE_KEY) || "buyer";
}
export function setMode(mode) {
  sessionStorage.setItem(MODE_KEY, mode);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mode, setModeState] = useState(getMode());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setLoading(false);

      // Keep a lightweight account doc for analytics / future
      if (u) {
        await setDoc(
          doc(db, "accounts", u.uid),
          {
            uid: u.uid,
            email: u.email || "",
            name: u.displayName || "",
            photoURL: u.photoURL || "",
            lastSeenAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    });
    return () => unsub();
  }, []);

  function switchMode(nextMode) {
    setMode(nextMode);
    setModeState(nextMode);
  }

  async function loginAs(nextMode) {
    switchMode(nextMode);
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  }

  async function logout() {
    await signOut(auth);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      mode,
      switchMode,
      loginAsBuyer: () => loginAs("buyer"),
      loginAsSeller: () => loginAs("seller"),
      logout,
    }),
    [user, loading, mode]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
