import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null) // 'buyer' | 'seller' | null
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null)
      if (!u) {
        setRole(null)
        setLoading(false)
        return
      }
      try {
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        const data = snap.exists() ? snap.data() : {}
        setRole(data.role ?? null)
      } catch {
        setRole(null)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = useMemo(() => ({ user, role, loading, loginWithGoogle, logout }), [user, role, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
