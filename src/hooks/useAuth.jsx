import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";

const AuthContext = createContext(null);

async function ensureUserProfile(user, role) {
  if (!user?.uid) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(
      ref,
      {
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || "",
        photoURL: user.photoURL || "",
        role: role || "buyer", // buyer | seller
        sellerPlanId: null, // for sellers later
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return;
  }

  // Keep role consistent if user is newly using buyer/seller flow
  const existing = snap.data();
  const mergedRole = role || existing.role || "buyer";

  await setDoc(
    ref,
    {
      email: user.email || existing.email || "",
      name: user.displayName || existing.name || "",
      photoURL: user.photoURL || existing.photoURL || "",
      role: mergedRole,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

function getRoleHintFromLocalStorage() {
  const v = (localStorage.getItem("picsellart_role_hint") || "").toLowerCase();
  if (v === "seller") return "seller";
  return "buyer";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // user doc from firestore
  const [loading, setLoading] = useState(true);

  // Handle redirect flow results (for Brave / popup blocked cases)
  useEffect(() => {
    let mounted = true;

    async function handleRedirect() {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user && mounted) {
          const role = getRoleHintFromLocalStorage();
          await ensureUserProfile(result.user, role);
        }
      } catch (e) {
        // Redirect failures will be surfaced by login page as well,
        // but we keep this silent here to avoid breaking UI.
        console.warn("Redirect result error:", e);
      }
    }

    handleRedirect();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u || null);

        if (!u) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const role = getRoleHintFromLocalStorage();
        await ensureUserProfile(u, role);

        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        setProfile(snap.exists() ? snap.data() : null);
      } catch (e) {
        console.error("Auth state handling error:", e);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,

      // Set role hint BEFORE login (buyer page sets buyer, seller page sets seller)
      setRoleHint: (role) => {
        localStorage.setItem("picsellart_role_hint", role === "seller" ? "seller" : "buyer");
      },

      // Google login with popup + redirect fallback
      loginWithGoogle: async () => {
        const role = getRoleHintFromLocalStorage();

        try {
          const res = await signInWithPopup(auth, googleProvider);
          await ensureUserProfile(res.user, role);
          return { ok: true };
        } catch (e) {
          const code = e?.code || "";

          // Popup blocked or not supported → fallback to redirect
          const shouldRedirect =
            code === "auth/popup-blocked" ||
            code === "auth/popup-closed-by-user" ||
            code === "auth/cancelled-popup-request" ||
            code === "auth/operation-not-supported-in-this-environment";

          if (shouldRedirect) {
            await signInWithRedirect(auth, googleProvider);
            return { ok: true, redirected: true };
          }

          return { ok: false, error: e };
        }
      },

      logout: async () => {
        await signOut(auth);
      },
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
