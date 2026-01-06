// FILE: src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

async function upsertUserBase(user, roleHint = null) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const base = {
    uid: user.uid,
    email: user.email || "",
    photoURL: user.photoURL || "",
    updatedAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    await setDoc(ref, {
      ...base,
      createdAt: serverTimestamp(),
      role: roleHint || null,
      displayName: user.displayName || "",
      buyerProfile: null,
      sellerProfile: null,
    });
  } else {
    const existing = snap.data();
    await setDoc(
      ref,
      {
        ...base,
        displayName: existing.displayName || user.displayName || "",
        role: roleHint || existing.role || null,
      },
      { merge: true }
    );
  }

  const fresh = await getDoc(ref);
  return fresh.data();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        const data = await upsertUserBase(u, null);
        setUserDoc(data || null);
      } else {
        setUserDoc(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const api = useMemo(() => {
    return {
      user,
      userDoc,
      loading,
      async signIn(roleHint) {
        const res = await signInWithPopup(auth, googleProvider);
        const data = await upsertUserBase(res.user, roleHint || null);
        setUserDoc(data || null);
        return res.user;
      },
      async refreshUserDoc() {
        if (!auth.currentUser) return null;
        const ref = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;
        setUserDoc(data);
        return data;
      },
      async logout() {
        await signOut(auth);
      },
    };
  }, [user, userDoc, loading]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
