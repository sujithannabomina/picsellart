// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);           // Firebase user
  const [role, setRole] = useState(null);           // 'buyer' | 'seller' | null
  const [plan, setPlan] = useState(null);           // active seller plan or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (!u) {
        setRole(null);
        setPlan(null);
        setLoading(false);
        return;
      }
      // read user doc
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setRole(data.role || null);
        setPlan(data.activePlan || null);
      } else {
        // create minimal doc on first sign in
        await setDoc(ref, {
          createdAt: serverTimestamp(),
          role: null,
          activePlan: null,
          displayName: u.displayName || "",
          email: u.email || "",
        });
        setRole(null);
        setPlan(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginAs = async (targetRole) => {
    // instant google popup
    const cred = await signInWithPopup(auth, googleProvider);
    const u = cred.user;
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        createdAt: serverTimestamp(),
        role: targetRole,     // set initial role
        activePlan: null,
        displayName: u.displayName || "",
        email: u.email || "",
      });
      setRole(targetRole);
    } else {
      const data = snap.data();
      // upgrade role if needed (seller > buyer precedence only when seller chosen)
      const newRole = targetRole === "seller" ? "seller" : (data.role ?? "buyer");
      if (newRole !== data.role) {
        await setDoc(ref, { ...data, role: newRole }, { merge: true });
      }
      setRole(newRole);
    }
  };

  const loginBuyer = async () => loginAs("buyer");
  const loginSeller = async () => loginAs("seller");

  const logout = async () => {
    await signOut(auth);
    setRole(null);
    setPlan(null);
  };

  const value = useMemo(
    () => ({ user, role, plan, loading, loginBuyer, loginSeller, logout }),
    [user, role, plan, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
