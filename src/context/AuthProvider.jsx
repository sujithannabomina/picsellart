import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, googleProvider } from "../lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>
    onAuthStateChanged(auth, async (u) => {
      if (!u) { setUser(null); setProfile(null); setLoading(false); return; }
      setUser(u);
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      setProfile(snap.exists() ? snap.data() : null);
      setLoading(false);
    }), []);

  const loginWithGoogle = async (role) => {
    const cred = await signInWithPopup(auth, googleProvider);
    const ref = doc(db, "users", cred.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const data = { uid: cred.user.uid, email: cred.user.email, role, plan: null, createdAt: serverTimestamp() };
      await setDoc(ref, data);
      setProfile(data);
    } else {
      const data = snap.data();
      if (!data.role && role) { data.role = role; await setDoc(ref, data, { merge: true }); }
      setProfile(data);
    }
    return cred.user;
  };

  const logout = () => signOut(auth);
  return <Ctx.Provider value={{ user, profile, setProfile, loginWithGoogle, logout, loading }}>{children}</Ctx.Provider>;
}
