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


const Ctx = createContext()


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
export const useAuth = () => useContext(Ctx)