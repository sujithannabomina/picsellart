// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * We initialize the context with a NON-NULL default object so that
 * useAuth() consumers can always destructure safely even before the
 * provider mounts (e.g., during SSR/first paint).
 */
const DEFAULT_VALUE = {
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
};

const AuthContext = createContext(DEFAULT_VALUE);

/**
 * Hook your components will use.
 * This will NEVER return null; it always returns a safe object.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || DEFAULT_VALUE;
}

/**
 * Provider that subscribes to Firebase Auth and (optionally) loads a user profile
 * document from Firestore at `users/{uid}` if present.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth state subscription
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        setUser(fbUser || null);

        if (fbUser) {
          // Optional profile load — if you don’t have this collection yet,
          // this will just be a no-op.
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        } else {
          setProfile(null);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("AuthProvider profile load error:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Auth actions
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await fbSignOut(auth);
    // Optional: send users home after logout
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signInWithGoogle,
      signOut,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
