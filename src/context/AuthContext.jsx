import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "buyer" | "seller" | null
  const [sellerHasActivePlan, setSellerHasActivePlan] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() =>
    onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (!u) {
        setRole(null);
        setSellerHasActivePlan(false);
        setLoading(false);
        return;
      }
      // Read role & plan state from Firestore if present
      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : {};
        setRole(data.role ?? null);
        setSellerHasActivePlan(Boolean(data.activePlan));
      } catch {
        setRole(null);
        setSellerHasActivePlan(false);
      } finally {
        setLoading(false);
      }
    })
  , []);

  const googleLogin = async (forcedRole) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Persist chosen role so the header & routes know how to behave
    if (forcedRole) {
      const res = await fetch("/api/secureCreatePhoto", { method: "POST", headers: {"x-role": forcedRole} });
      // The endpoint can be a noop; we just need a secure write to let CF/SSR set role if you prefer.
    }
    return result;
  };

  const logout = () => signOut(auth);

  const value = useMemo(() => ({
    user, role, setRole, sellerHasActivePlan, setSellerHasActivePlan, googleLogin, logout, loading
  }), [user, role, sellerHasActivePlan, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
