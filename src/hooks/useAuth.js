// src/hooks/useAuth.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

function safeUser(user) {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "buyer" | "seller" | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        if (!u) {
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        setUser(safeUser(u));

        // Read role from Firestore (users/{uid})
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;

        setRole(data?.role || null);
      } catch (e) {
        console.error("Auth state error:", e);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  async function loginAsBuyer() {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const u = res.user;

    // Write buyer role
    await setDoc(
      doc(db, "users", u.uid),
      {
        role: "buyer",
        email: u.email || "",
        name: u.displayName || "",
        photoURL: u.photoURL || "",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    setUser(safeUser(u));
    setRole("buyer");
    return u;
  }

  async function loginAsSeller() {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const u = res.user;

    // Write seller role
    await setDoc(
      doc(db, "users", u.uid),
      {
        role: "seller",
        email: u.email || "",
        name: u.displayName || "",
        photoURL: u.photoURL || "",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    setUser(safeUser(u));
    setRole("seller");
    return u;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setRole(null);
  }

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      loginAsBuyer,
      loginAsSeller,
      logout,
      isBuyer: role === "buyer",
      isSeller: role === "seller",
      isAuthed: !!user,
    }),
    [user, role, loading]
  );

  // ✅ IMPORTANT: no JSX here (build-safe)
  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx; // can be null if provider missing
}
