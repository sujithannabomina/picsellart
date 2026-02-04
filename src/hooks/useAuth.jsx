// FILE PATH: src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthCtx = createContext(null);

function normalizeUser(u) {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email || "",
    displayName: u.displayName || "",
    photoURL: u.photoURL || "",
    _raw: u,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(normalizeUser(u));
      setBooting(false);
    });
    return () => unsub();
  }, []);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const res = await signInWithPopup(auth, provider);
    return normalizeUser(res.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // -------- Buyer helpers --------
  const ensureBuyerProfile = async (u) => {
    if (!u?.uid) throw new Error("Login failed. Please try again.");

    const ref = doc(db, "buyers", u.uid);
    const snap = await getDoc(ref);

    // Create once. Keep minimal fields (production safe).
    if (!snap.exists()) {
      await setDoc(
        ref,
        {
          uid: u.uid,
          email: u.email || "",
          name: u.displayName || "",
          photoURL: u.photoURL || "",
          role: "buyer",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      // Refresh updatedAt (cheap + helps debugging)
      await setDoc(ref, { updatedAt: serverTimestamp() }, { merge: true });
    }
  };

  // -------- Seller helpers (needed to block buyer if seller exists) --------
  const getSellerDoc = async (uid) => {
    if (!uid) return null;
    const s = await getDoc(doc(db, "sellers", uid));
    return s.exists() ? s.data() : null;
  };

  const value = useMemo(
    () => ({
      user,
      booting,
      googleLogin,
      logout,
      ensureBuyerProfile,
      getSellerDoc,
    }),
    [user, booting]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
