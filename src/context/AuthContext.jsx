import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import firebaseConfig from "../firebase";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>
    onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      setUser(u);
      // fetch role
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      setRole(snap.exists() ? snap.data().role || null : null);
      setLoading(false);
    }), []);

  const loginAs = async (asRole) => {
    const res = await signInWithPopup(auth, provider);
    const u = res.user;
    // persist/update role
    await setDoc(
      doc(db, "users", u.uid),
      {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName || "",
        photoURL: u.photoURL || "",
        role: asRole,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    setRole(asRole);
    return u;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthCtx.Provider value={{ user, role, loading, loginAs, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
