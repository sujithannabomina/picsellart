// src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

async function ensureUserProfile(uid, payload) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...payload, createdAt: serverTimestamp() }, { merge: true });
    return { ...payload, createdAt: null };
  }
  return snap.data();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);

      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          // create minimal profile (role will be set by buyer/seller login page)
          const base = {
            uid: u.uid,
            email: u.email || "",
            displayName: u.displayName || "",
            photoURL: u.photoURL || "",
            role: "guest",
          };
          await setDoc(ref, { ...base, createdAt: serverTimestamp() }, { merge: true });
          setProfile(base);
        }
      } catch (e) {
        console.error("Auth profile load error:", e);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const api = useMemo(() => {
    return {
      user,
      profile,
      loading,
      async loginWithGoogleAs(role) {
        // role must be "buyer" or "seller"
        const res = await signInWithPopup(auth, googleProvider);
        const u = res.user;

        const payload = {
          uid: u.uid,
          email: u.email || "",
          displayName: u.displayName || "",
          photoURL: u.photoURL || "",
          role,
          updatedAt: serverTimestamp(),
        };

        const saved = await ensureUserProfile(u.uid, payload);
        setProfile(saved);
        return u;
      },
      async logout() {
        await signOut(auth);
      },
    };
  }, [user, profile, loading]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
