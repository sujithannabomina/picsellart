import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function BuyerLogin() {
  const { user, role, loginWithGoogle } = useAuth()
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  // If already a buyer, go to dashboard
  useEffect(() => {
    if (user && role === 'buyer') nav('/buyer/dashboard')
    // If a seller tries to open buyer login, push them to seller dashboard
    if (user && role === 'seller') nav('/seller/dashboard')
  }, [user, role, nav])

  const handleGoogle = async () => {
    try {
      setBusy(true)
      await loginWithGoogle()
      // Ensure role is set to 'buyer' on first login
      if (!user?.uid) return
      const uref = doc(db, 'users', user.uid)
      const snap = await getDoc(uref)
      if (!snap.exists() || !snap.data().role) {
        await setDoc(
          uref,
          { role: 'buyer', createdAt: new Date().toISOString() },
          { merge: true }
        )
      }
      nav('/buyer/dashboard')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Buyer Login / Sign Up</h1>

      <div className="rounded-2xl border p-6 shadow-sm">
        <p className="text-sm text-gray-600 mb-4">
          Continue with Google to sign in as a <b>Buyer</b>. You’ll be redirected to your dashboard.
        </p>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="w-full h-11 rounded-md bg-black text-white disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Continue with Google'}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          If you meant to sell photos, <a href="/seller/login" className="underline">login as a Seller</a>.
        </p>
      </div>
    </div>
  )
}
