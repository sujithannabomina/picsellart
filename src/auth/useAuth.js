import { useEffect, useState, useContext, createContext } from "react";
import { onAuthStateChanged, getAuth, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ user: null, role: null, loading: true });

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAuthState({ user: null, role: null, loading: false });
        return;
      }
      // Ensure user doc exists and grab role
      const userRef = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        // Default to buyer unless you set during login page
        await setDoc(userRef, {
          displayName: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          role: "buyer",
          createdAt: serverTimestamp(),
        });
        setAuthState({ user: firebaseUser, role: "buyer", loading: false });
      } else {
        const data = snap.data();
        setAuthState({ user: firebaseUser, role: data.role || "buyer", loading: false });
      }
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async (desiredRole = "buyer") => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    // Ensure role is set (first time or overwrite if you want per-login page)
    const userRef = doc(db, "users", res.user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        displayName: res.user.displayName || "",
        email: res.user.email || "",
        role: desiredRole,
        createdAt: serverTimestamp(),
      });
    }
    // Update local state
    setAuthState((s) => ({ ...s, user: res.user, role: desiredRole }));
    return res.user;
  };

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setAuthState({ user: null, role: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
