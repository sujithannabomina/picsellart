// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  auth,
  google,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  db,
  serverTs,
  ensureUserDoc,
} from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'buyer' | 'seller' | null
  const [loading, setLoading] = useState(true);

  // read role from users/{uid}
  async function loadRole(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const r = snap.data()?.role ?? null;
      setRole(r);
    } else {
      setRole(null);
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await loadRole(u.uid);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Direct Google sign-ins
  const signInBuyer = async () => {
    const res = await signInWithPopup(auth, google);
    await ensureUserDoc(res.user.uid, {
      email: res.user.email,
      displayName: res.user.displayName || '',
      role: 'buyer',
    });
    setRole('buyer');
    return res.user;
  };

  const signInSeller = async () => {
    const res = await signInWithPopup(auth, google);
    await ensureUserDoc(res.user.uid, {
      email: res.user.email,
      displayName: res.user.displayName || '',
      role: 'seller',
    });
    setRole('seller');
    // also ensure a seller doc placeholder (plan status)
    const sRef = doc(db, 'sellers', res.user.uid);
    const sSnap = await getDoc(sRef);
    if (!sSnap.exists()) {
      await setDoc(sRef, { activePlan: false, createdAt: serverTs() });
    }
    return res.user;
  };

  const signOutAll = async () => {
    await signOut(auth);
    setRole(null);
  };

  const value = useMemo(
    () => ({ user, role, loading, signInBuyer, signInSeller, signOutAll }),
    [user, role, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
