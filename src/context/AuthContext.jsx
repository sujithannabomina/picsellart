import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'buyer' | 'seller' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const r = await getDoc(doc(db, "roles", u.uid));
        setRole(r.exists() ? r.data().role : null);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
  }, []);

  async function loginBuyer() {
    const u = await signInWithPopup(auth, new GoogleAuthProvider());
    await setDoc(doc(db, "roles", u.user.uid), { role: "buyer" }, { merge: true });
    setRole("buyer");
    return u;
  }

  async function loginSeller() {
    const u = await signInWithPopup(auth, new GoogleAuthProvider());
    await setDoc(doc(db, "roles", u.user.uid), { role: "seller" }, { merge: true });
    setRole("seller");
    return u;
  }

  async function ensureBuyer() {
    if (!user) await loginBuyer();
    if (role !== "buyer") {
      await setDoc(doc(db, "roles", auth.currentUser.uid), { role: "buyer" }, { merge: true });
      setRole("buyer");
    }
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <Ctx.Provider value={{ user, role, loading, loginBuyer, loginSeller, ensureBuyer, logout }}>
      {children}
    </Ctx.Provider>
  );
}
export function useAuth() {
  return useContext(Ctx);
}
