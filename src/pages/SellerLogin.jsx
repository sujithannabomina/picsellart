import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function SellerLogin() {
  const { user, role, loginWithGoogle } = useAuth()
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  // If already a seller, send to the seller funnel (plan/start) or dashboard
  useEffect(() => {
    if (user && role === 'seller') nav('/seller/start')
    if (user && role === 'buyer') nav('/buyer/dashboard')
  }, [user, role, nav])

  const handleGoogle = async () => {
    try {
      setBusy(true)
      await loginWithGoogle()
      if (!user?.uid) return
      const uref = doc(db, 'users', user.uid)
      const snap = await getDoc(uref)
      if (!snap.exists() || !snap.data().role) {
        await setDoc(
          uref,
          { role: 'seller', createdAt: new Date().toISOString() },
          { merge: true }
        )
      }
      nav('/seller/start') // step where a seller chooses plan, then to /seller/subscribe, then /seller/dashboard
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Seller Login / Sign Up</h1>

      <div className="rounded-2xl border p-6 shadow-sm">
        <p className="text-sm text-gray-600 mb-4">
          Continue with Google to sign in as a <b>Seller</b>. You’ll pick a plan and get access to your dashboard.
        </p>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="w-full h-11 rounded-md bg-black text-white disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Continue with Google'}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          If you meant to buy images, <a href="/buyer/login" className="underline">login as a Buyer</a>.
        </p>
      </div>
    </div>
  )
}
