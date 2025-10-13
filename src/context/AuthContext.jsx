import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Always provide a non-null default to avoid destructuring crashes
const AuthContext = createContext({
  user: null,
  role: null,
  profile: null,
  loading: true,
  isSeller: false,
  isBuyer: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setRole(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(firebaseUser);

        // Ensure a user doc exists; read role if present
        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          // default to buyer unless/ until user completes seller onboarding
          const newDoc = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: 'buyer',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(ref, newDoc, { merge: true });
          setRole('buyer');
          setProfile(newDoc);
        } else {
          const data = snap.data() || {};
          setRole(data.role || 'buyer');
          setProfile(data);
        }
      } catch (e) {
        // In case of any read/write error, don’t crash the tree
        console.error('[AuthProvider] error:', e);
        setRole(null);
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
      role,
      profile,
      loading,
      isSeller: role === 'seller',
      isBuyer: role === 'buyer',
    }),
    [user, role, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
