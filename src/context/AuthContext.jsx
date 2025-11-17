// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "buyer" | "seller" | null
  const [loading, setLoading] = useState(true);

  const provider = new GoogleAuthProvider();

  const doLogin = async (desiredRole) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      setUser(loggedInUser);
      setRole(desiredRole);
      localStorage.setItem("picsellart_role", desiredRole);

      return { user: loggedInUser, role: desiredRole };
    } catch (err) {
      console.error("Google login failed:", err);
      throw err;
    }
  };

  const loginAsBuyer = () => doLogin("buyer");
  const loginAsSeller = () => doLogin("seller");

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setRole(null);
      localStorage.removeItem("picsellart_role");
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("picsellart_role");
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setRole(storedRole || null);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const value = {
    user,
    role,
    loading,
    loginAsBuyer,
    loginAsSeller,
    logout,
    isBuyer: !!user && role === "buyer",
    isSeller: !!user && role === "seller",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
