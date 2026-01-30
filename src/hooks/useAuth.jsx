// FILE PATH: src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setBooting(false);
    });
    return () => unsub();
  }, []);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    // Helps during testing: always let you choose account
    provider.setCustomParameters({ prompt: "select_account" });
    const res = await signInWithPopup(auth, provider);
    return res.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Ensure buyer profile exists (users/{uid}) — used by BuyerLogin
  const ensureBuyerProfile = async (u) => {
    if (!u?.uid) throw new Error("Missing user");
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);

    await setDoc(
      ref,
      {
        uid: u.uid,
        email: u.email || "",
        displayName: u.displayName || "",
        photoURL: u.photoURL || "",
        type: "buyer",
        createdAt: snap.exists() ? snap.data()?.createdAt || serverTimestamp() : serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  };

  // Read seller doc for routing decisions
  const getSellerDoc = async (uid) => {
    if (!uid) return null;
    const snap = await getDoc(doc(db, "sellers", uid));
    return snap.exists() ? snap.data() : null;
  };

  const value = useMemo(
    () => ({ user, booting, googleLogin, logout, ensureBuyerProfile, getSellerDoc }),
    [user, booting]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
