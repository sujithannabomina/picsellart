import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, db, serverTs } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null) // users/{uid} doc
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null)
      if (u) {
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setProfile(snap.data())
        } else {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const value = useMemo(() => {
    const role = profile?.role || null
    const sub = profile?.subscription || null
    const now = Date.now()
    const active =
      sub && typeof sub.expiresAt === 'number' ? now < sub.expiresAt : false

    return {
      user,
      profile,
      role,
      sellerActive: role === 'seller' && active,
      loading,
      // ensure a users/{uid} doc exists with a role
      ensureRoleDoc: async (roleWanted) => {
        if (!user) return
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            role: roleWanted,
            createdAt: serverTs(),
          })
          const fresh = await getDoc(ref)
          setProfile(fresh.data())
          return
        }
        const cur = snap.data()
        if (!cur.role && roleWanted) {
          await setDoc(ref, { ...cur, role: roleWanted }, { merge: true })
          const fresh = await getDoc(ref)
          setProfile(fresh.data())
        }
      },
    }
  }, [user, profile])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
