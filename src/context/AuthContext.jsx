// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  isBuyer: false,
  isSeller: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u ?? null);
        if (u) {
          // lightweight profile fetch; tolerate missing profile
          const snap = await getDoc(doc(db, "users", u.uid));
          setProfile(snap.exists() ? snap.data() : null);
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await fbSignOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      // simple flags; your profile schema may carry roles
      isBuyer: Boolean(profile?.role === "buyer" || profile?.isBuyer),
      isSeller: Boolean(profile?.role === "seller" || profile?.isSeller),
      serverTs: serverTimestamp, // available where needed
      signInWithGoogle,
      signOut,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
