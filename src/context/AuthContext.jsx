// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setReady(true);
    });
    return () => unsub();
  }, []);

  const signInBuyer = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const signInSeller = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, ready, signInBuyer, signInSeller, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
