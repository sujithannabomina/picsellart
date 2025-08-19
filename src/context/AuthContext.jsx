import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, db } from '../firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) setProfile(snap.data())
        else setProfile(null)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const value = useMemo(() => ({
    user,
    profile,
    loading,

    async emailSignUp(email, password, role) {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email,
        role,
        createdAt: serverTimestamp(),
      })
      return cred.user
    },

    async emailSignIn(email, password) {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      return cred.user
    },

    async googleSignIn(role) {
      const provider = new GoogleAuthProvider()
      const { user: u } = await signInWithPopup(auth, provider)
      const ref = doc(db, 'users', u.uid)
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: u.uid,
          email: u.email,
          role,
          createdAt: serverTimestamp(),
        })
      }
      return u
    },

    async logout() {
      await signOut(auth)
    },
  }), [user, profile, loading])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
