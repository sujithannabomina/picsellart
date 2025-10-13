// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [fbUser, setFbUser] = useState(null);
  const [role, setRole] = useState(null); // 'buyer' | 'seller' | null

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFbUser(user || null);

      if (user) {
        try {
          const snap = await getDoc(doc(db, 'profiles', user.uid));
          setRole(snap.exists() ? snap.data().role ?? null : null);
        } catch {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setInitializing(false);
    });

    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      initializing,
      user: fbUser,
      role,
      logout: () => signOut(auth),
    }),
    [initializing, fbUser, role]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  // Defensive: never destructure a null provider
  if (!ctx) return { initializing: false, user: null, role: null, logout: () => {} };
  return ctx;
}
