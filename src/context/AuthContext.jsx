import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user
  const [role, setRole] = useState(null); // "buyer" | "seller" | null
  const [loading, setLoading] = useState(true);

  // Read role from Firestore
  async function loadUserRole(firebaseUser) {
    if (!firebaseUser) {
      setRole(null);
      return;
    }

    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // Create a very small profile doc without assuming role.
      const profile = {
        email: firebaseUser.email || null,
        displayName: firebaseUser.displayName || null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        role: null,
      };
      await setDoc(ref, profile);
      setRole(null);
      return;
    }

    const data = snap.data();
    setRole(data.role || null);
  }

  // Persist role change to Firestore
  async function setRoleOnServer(uid, nextRole) {
    const ref = doc(db, "users", uid);
    await setDoc(
      ref,
      {
        role: nextRole,
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await loadUserRole(firebaseUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const loginWithGoogle = async (asRole) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Persist role choice (buyer or seller)
      if (asRole === "buyer" || asRole === "seller") {
        await setRoleOnServer(firebaseUser.uid, asRole);
        setRole(asRole);
      }

      setUser(firebaseUser);
      return firebaseUser;
    } finally {
      setLoading(false);
    }
  };

  const loginAsBuyer = () => loginWithGoogle("buyer");
  const loginAsSeller = () => loginWithGoogle("seller");

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      isBuyer: role === "buyer",
      isSeller: role === "seller",
      loginAsBuyer,
      loginAsSeller,
      logout,
    }),
    [user, role, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && (
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            color: "#64748b",
          }}
        >
          Signing you in…
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider />");
  }
  return ctx;
}
