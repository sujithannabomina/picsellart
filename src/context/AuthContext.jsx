// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase"; // if you already export auth from firebase.js

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "buyer" | "seller" | null
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      // later you can load role from Firestore; for now keep simple:
      setUser(firebaseUser);
      setRole(localStorage.getItem("picsellartRole") || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (selectedRole) => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    localStorage.setItem("picsellartRole", selectedRole);
    setRole(selectedRole);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("picsellartRole");
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    loginWithGoogle,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
