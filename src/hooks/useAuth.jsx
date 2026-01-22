// src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setBooting(false);
    });
    return () => unsub();
  }, []);

  const api = useMemo(() => {
    return {
      user,
      booting,

      async googleLogin() {
        const res = await signInWithPopup(auth, googleProvider);
        return res.user;
      },

      async logout() {
        await signOut(auth);
      },

      // Buyer profile is stored at buyers/{uid}
      async ensureBuyerProfile(u) {
        const ref = doc(db, "buyers", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: u.uid,
            email: u.email || "",
            name: u.displayName || "",
            photoURL: u.photoURL || "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          await updateDoc(ref, { updatedAt: serverTimestamp() });
        }
      },

      // Seller profile is stored at sellers/{uid}
      async getSellerProfile(uid) {
        const ref = doc(db, "sellers", uid);
        const snap = await getDoc(ref);
        return snap.exists() ? snap.data() : null;
      },
    };
  }, [user, booting]);

  return <AuthCtx.Provider value={api}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
