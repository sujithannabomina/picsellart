// src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

const provider = new GoogleAuthProvider();

// Helpers
async function ensureUserDoc({ user, role }) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email || "",
      name: user.displayName || "",
      photoURL: user.photoURL || "",
      role: role || "buyer",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return role || "buyer";
  }

  // If doc exists, keep role from DB unless caller forces a role.
  const data = snap.data() || {};
  const existingRole = data.role || "buyer";

  // If user is logging in via Buyer/Seller page, we allow updating role explicitly.
  if (role && role !== existingRole) {
    await setDoc(
      ref,
      { role, updatedAt: serverTimestamp() },
      { merge: true }
    );
    return role;
  }

  return existingRole;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "buyer" | "seller"
  const [loading, setLoading] = useState(true);

  // Track auth session
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setLoading(true);
        if (!u) {
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        setUser(u);

        // Load role from Firestore
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data() || {};
          setRole(data.role || "buyer");
        } else {
          // If no doc, create as buyer by default
          const r = await ensureUserDoc({ user: u, role: "buyer" });
          setRole(r);
        }
      } catch (e) {
        console.error("Auth state error:", e);
        setUser(u || null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // Role-based Google login
  async function loginWithGoogle(asRole) {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, provider);
      const u = res.user;

      const finalRole = await ensureUserDoc({ user: u, role: asRole });
      setUser(u);
      setRole(finalRole);

      return { ok: true, role: finalRole };
    } catch (e) {
      console.error("Google login failed:", e);
      return { ok: false, error: e?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
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
      loginWithGoogle,
      logout,
    }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
