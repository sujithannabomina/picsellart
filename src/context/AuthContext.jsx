import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, db, serverTs } from '../firebase'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) { setRole(null); setLoading(false); return }
      try {
        const snap = await getDoc(doc(db, 'users', u.uid))
        setRole(snap.exists() ? snap.data().role || null : null)
      } catch { setRole(null) }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const ensureUserDoc = async (u, r) => {
    const ref = doc(db, 'users', u.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        role: r,
        email: u.email || '',
        displayName: u.displayName || '',
        createdAt: serverTs(),
        updatedAt: serverTs(),
      })
    }
  }

  const signInWithRole = async (r) => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const res = await signInWithPopup(auth, provider)
    await ensureUserDoc(res.user, r)
    const snap = await getDoc(doc(db, 'users', res.user.uid))
    setRole(snap.exists() ? snap.data().role || null : null)
    return res.user
  }

  const value = useMemo(() => ({
    user, role, loading,
    loginBuyer: () => signInWithRole('buyer'),
    loginSeller: () => signInWithRole('seller'),
    logout: () => signOut(auth),
  }), [user, role, loading])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
