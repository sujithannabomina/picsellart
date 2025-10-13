import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut as fbSignOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext({ user: null, role: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [role, setRole]   = useState(null);   // "buyer" | "seller" | null
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
        setUser(u);

        // read role from Firestore (users/{uid})
        const ref = doc(db, 'users', u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role ?? null);
        } else {
          // first login – create a minimal doc with unknown role
          await setDoc(ref, {
            uid: u.uid,
            email: u.email ?? '',
            displayName: u.displayName ?? '',
            role: null,
            createdAt: serverTimestamp()
          }, { merge: true });
          setRole(null);
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signInGoogle = async () => {
    const prov = new GoogleAuthProvider();
    await signInWithPopup(auth, prov);
  };

  const signInEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signUpEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signOut = () => fbSignOut(auth);

  const value = useMemo(() => ({
    user, role, loading, signOut, signInGoogle, signInEmail, signUpEmail,
  }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
