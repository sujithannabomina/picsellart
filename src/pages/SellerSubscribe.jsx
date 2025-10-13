import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db, serverTs } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { loadRazorpay, openCheckout } from '../utils/razorpay'

const SUBSCRIPTION_PRICE = 499 // INR

export default function SellerSubscribe() {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  useEffect(() => { loadRazorpay() }, [])

  const start = async () => {
    setErr(''); setBusy(true)
    try {
      // 1) create order
      const resp = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'subscription',
          amount: SUBSCRIPTION_PRICE,
          currency: 'INR',
          meta: { uid: user.uid, type: 'seller_subscription' },
        }),
      })
      const { order, keyId, error } = await resp.json()
      if (error) throw new Error(error)

      // 2) open checkout
      await openCheckout({
        key: keyId,
        amount: SUBSCRIPTION_PRICE,
        name: 'Picsellart',
        description: 'Seller Subscription',
        orderId: order?.id,
        prefill: { name: user.displayName || '', email: user.email || '' },
        notes: { uid: user.uid, purpose: 'subscription' },
        handler: async (rzpRes) => {
          // 3) verify
          const ver = await fetch('/api/verifyPayment', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...rzpRes, meta: { uid: user.uid, purpose: 'subscription' } }),
          })
          const v = await ver.json()
          if (!v.ok) throw new Error(v.error || 'Verification failed')

          // 4) mark subscription active
          await setDoc(doc(db, 'subscriptions', user.uid), {
            active: true,
            startedAt: serverTs(),
            lastPaymentId: rzpRes.razorpay_payment_id,
            orderId: rzpRes.razorpay_order_id,
          }, { merge: true })

          alert('Subscription active! Redirecting to Seller Dashboard.')
          navigate('/seller/dashboard')
        },
      })
    } catch (e) {
      setErr(e?.message || 'Payment failed')
    } finally { setBusy(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-3">Become a Seller</h1>
      <p className="text-slate-700 mb-6">Pay ₹{SUBSCRIPTION_PRICE} to unlock the Seller Dashboard.</p>
      {err && <p className="text-red-600 mb-3">{err}</p>}
      <button onClick={start} disabled={busy} className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
        {busy ? 'Processing…' : 'Pay & Unlock'}
      </button>
    </div>
  )
}
