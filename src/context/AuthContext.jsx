import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, db, serverTimestamp } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null) // 'seller' | 'buyer' | null
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (!fbUser) {
          setUser(null)
          setRole(null)
          setLoading(false)
          return
        }

        setUser(fbUser)

        // Find (or create) a profile doc that stores the role.
        const uref = doc(db, 'users', fbUser.uid)
        const snap = await getDoc(uref)
        if (snap.exists()) {
          const data = snap.data()
          setRole(data.role ?? null)
        } else {
          // default every fresh account to 'buyer' until seller onboarding
          await setDoc(uref, {
            uid: fbUser.uid,
            email: fbUser.email ?? null,
            role: 'buyer',
            createdAt: serverTimestamp(),
          })
          setRole('buyer')
        }
      } catch (e) {
        console.error('Auth bootstrap error:', e)
        setUser(null)
        setRole(null)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  const value = useMemo(() => ({
    user, role, loading,
    logout: () => signOut(auth),
  }), [user, role, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
