// src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext(null);

const ROLE_KEY = "picsellart_pending_role";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "buyer" | "seller"
  const [loading, setLoading] = useState(true);

  // Handle redirect results (important for browsers blocking popups)
  useEffect(() => {
    (async () => {
      try {
        const res = await getRedirectResult(auth);
        if (res?.user) {
          // role we stored before redirect
          const pendingRole = localStorage.getItem(ROLE_KEY) || "buyer";
          await ensureUserDoc(res.user, pendingRole);
        }
      } catch (e) {
        // Ignore silently — UI will show login error on next action
      } finally {
        localStorage.removeItem(ROLE_KEY);
      }
    })();
  }, []);

  // Keep auth state in sync
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);

      if (!u) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          setRole(snap.data()?.role || null);
        } else {
          // default role if missing
          await ensureUserDoc(u, "buyer");
          setRole("buyer");
        }
      } catch (e) {
        // If Firestore blocked, still allow session, role fallback:
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const loginWithGoogle = async (asRole) => {
    // Save desired role for redirect fallback
    localStorage.setItem(ROLE_KEY, asRole);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      await ensureUserDoc(res.user, asRole);
      setUser(res.user);
      setRole(asRole);
      return { ok: true };
    } catch (err) {
      // Fallback to redirect (more reliable on some browsers)
      try {
        await signInWithRedirect(auth, googleProvider);
        return { ok: true };
      } catch (e2) {
        localStorage.removeItem(ROLE_KEY);
        return { ok: false, error: humanAuthError(err) };
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

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
};

async function ensureUserDoc(firebaseUser, asRole) {
  if (!firebaseUser?.uid) return;
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);

  // Don’t overwrite existing role (security)
  if (snap.exists()) return;

  await setDoc(ref, {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || "",
    photoURL: firebaseUser.photoURL || "",
    role: asRole, // buyer | seller
    createdAt: serverTimestamp(),
  });
}

function humanAuthError(err) {
  const code = err?.code || "";
  if (code.includes("popup-closed-by-user")) return "Popup closed. Please try again.";
  if (code.includes("popup-blocked")) return "Popup blocked. Please allow popups and try again.";
  if (code.includes("network-request-failed")) return "Network error. Check internet and try again.";
  return "Login failed. Please try again.";
}

export const useAuth = () => useContext(AuthContext);
