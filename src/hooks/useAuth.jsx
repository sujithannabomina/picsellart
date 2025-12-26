// src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState("");

  // Handle redirect sign-in results (for Safari/Brave popup-block cases)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!mounted) return;

        if (result?.user) {
          // redirect login success
          setAuthError("");
        }
      } catch (e) {
        if (!mounted) return;
        setAuthError(formatAuthError(e));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Subscribe to auth state changes (works for popup + redirect)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  async function loginWithGoogle() {
    setAuthError("");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      // Try popup first (best UX on desktop)
      await signInWithPopup(auth, provider);
      return { ok: true };
    } catch (e) {
      // Popup blocked / closed → fallback to redirect
      const code = e?.code || "";
      const shouldRedirect =
        code === "auth/popup-blocked" ||
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request" ||
        code === "auth/operation-not-supported-in-this-environment";

      if (shouldRedirect) {
        await signInWithRedirect(auth, provider);
        return { ok: true }; // browser will redirect away
      }

      setAuthError(formatAuthError(e));
      return { ok: false, error: formatAuthError(e) };
    }
  }

  async function logout() {
    setAuthError("");
    await signOut(auth);
  }

  const value = useMemo(
    () => ({
      user,
      initializing,
      authError,
      setAuthError,
      loginWithGoogle,
      logout,
    }),
    [user, initializing, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider />");
  }
  return ctx;
}

function formatAuthError(e) {
  const code = e?.code ? String(e.code) : "";
  const message = e?.message ? String(e.message) : "Login failed. Please try again.";
  // Keep it user-friendly but also show dev clue (code)
  if (code) return `${message} (${code})`;
  return message;
}
