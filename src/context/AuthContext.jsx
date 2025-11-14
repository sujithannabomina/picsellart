// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);
const provider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // firebase user
  const [role, setRole] = useState(null); // "buyer" | "seller" | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      try {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role || null);
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error("Error loading user role", err);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const loginAs = async (desiredRole) => {
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    const ref = doc(db, "users", firebaseUser.uid);
    await setDoc(
      ref,
      {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        role: desiredRole,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    setUser(firebaseUser);
    setRole(desiredRole);
  };

  const loginAsBuyer = () => loginAs("buyer");
  const loginAsSeller = () => loginAs("seller");

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    loading,
    loginAsBuyer,
    loginAsSeller,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
