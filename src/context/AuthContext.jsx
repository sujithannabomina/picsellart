// /src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "buyer" | "seller" | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginBuyer = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    setRole("buyer");
    return res.user;
  };

  const loginSeller = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    setRole("seller");
    return res.user;
  };

  const logout = async () => {
    await signOut(auth);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginBuyer, loginSeller, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
