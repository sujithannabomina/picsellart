import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext(null);

function safeNextPath(next) {
  if (!next) return null;
  // Only allow internal routes
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return null;
}

async function upsertRole(uid, role) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  const base = {
    updatedAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    await setDoc(ref, {
      roles: { buyer: role === "buyer", seller: role === "seller" },
      createdAt: serverTimestamp(),
      ...base,
    });
    return { roles: { buyer: role === "buyer", seller: role === "seller" } };
  }

  const data = snap.data() || {};
  const roles = data.roles || {};
  const newRoles = { ...roles, [role]: true };

  await setDoc(ref, { ...data, roles: newRoles, ...base }, { merge: true });
  return { roles: newRoles };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState({ buyer: false, seller: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (!u) {
        setRoles({ buyer: false, seller: false });
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        const data = snap.exists() ? snap.data() : {};
        setRoles(data?.roles || { buyer: false, seller: false });
      } catch {
        setRoles({ buyer: false, seller: false });
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const loginAsBuyer = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const { roles: newRoles } = await upsertRole(res.user.uid, "buyer");
    setRoles(newRoles);
    return res.user;
  };

  const loginAsSeller = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const { roles: newRoles } = await upsertRole(res.user.uid, "seller");
    setRoles(newRoles);
    return res.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      roles,
      loading,
      loginAsBuyer,
      loginAsSeller,
      logout,
      safeNextPath,
    }),
    [user, roles, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
