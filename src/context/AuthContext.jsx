import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, db, googleProvider } from '../firebase'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

// Non-null default value to avoid crashes even if the provider is absent.
const defaultValue = {
  loading: true,
  user: null,
  role: null,
  loginWithGoogle: async () => {},
  logout: async () => {},
}
const AuthCtx = createContext(defaultValue)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const off = onAuthStateChanged(auth, async (u) => {
      setUser(u || null)
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'users', u.uid))
          setRole(snap.exists() ? (snap.data().role || null) : null)
        } catch {
          setRole(null)
        }
      } else {
        setRole(null)
      }
      setLoading(false)
    })
    return () => off()
  }, [])

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = useMemo(
    () => ({ loading, user, role, loginWithGoogle, logout }),
    [loading, user, role]
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  // Always return an object (never null)
  return useContext(AuthCtx) || defaultValue
}
