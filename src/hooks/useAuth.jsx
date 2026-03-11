// FILE PATH: src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthCtx = createContext(null);

// ✅ Detect if running inside Capacitor Android app
function isCapacitorApp() {
  return window.Capacitor !== undefined && window.Capacitor.isNative === true;
}

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
    // ✅ Check for redirect result when app loads
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("✅ Redirect login success:", result.user.email);
        }
      })
      .catch((err) => {
        console.error("Redirect result error:", err);
      });

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(normalizeUser(u));
      setBooting(false);
    });
    return () => unsub();
  }, []);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    if (isCapacitorApp()) {
      // ✅ Use redirect for Capacitor Android app
      await signInWithRedirect(auth, provider);
      return null; // onAuthStateChanged will handle the result
    } else {
      // ✅ Use popup for regular browser
      const res = await signInWithPopup(auth, provider);
      return normalizeUser(res.user);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const ensureBuyerProfile = async (u) => {
    if (!u?.uid) throw new Error("Login failed. Please try again.");
    const ref = doc(db, "buyers", u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: u.uid,
        email: u.email || "",
        name: u.displayName || "",
        photoURL: u.photoURL || "",
        role: "buyer",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } else {
      await setDoc(ref, { updatedAt: serverTimestamp() }, { merge: true });
    }
  };

  const getSellerDoc = async (uid) => {
    if (!uid) return null;
    const s = await getDoc(doc(db, "sellers", uid));
    return s.exists() ? s.data() : null;
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