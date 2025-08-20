import Page from '../components/Page'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { openCheckout } from '../utils/razorpay'

export default function SellerOnboarding() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('profile') // profile -> payment -> done
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      if (!user) return
      const ref = doc(db, 'sellers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists() && snap.data()?.isActive) setStatus('done')
      setLoading(false)
    })()
  }, [user])

  async function saveProfile(e) {
    e.preventDefault()
    await setDoc(
      doc(db, 'sellers', user.uid),
      {
        uid: user.uid,
        displayName,
        phone,
        isActive: false,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    )
    setStatus('payment')
  }

  function resolvePlan() {
    const amount = Number(localStorage.getItem('seller_plan_amount') || import.meta.env.VITE_SELLER_REG_FEE || 49900)
    const name = localStorage.getItem('seller_plan_name') || 'Seller Activation'
    return { amount, name }
  }

  async function payAndActivate() {
    const { amount, name } = resolvePlan()
    const res = await fetch('/api/createOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, receipt: `seller_${user.uid}_${Date.now()}` }),
    })
    const { orderId } = await res.json()

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID
    await openCheckout({
      key,
      amount,
      name: `Picsellart ${name}`,
      description: 'One-time registration',
      orderId,
      prefill: { email: user.email },
      notes: { sellerId: user.uid, planName: name },
      handler: async (resp) => {
        const v = await fetch('/api/verifyPayment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, ...resp }),
        })
        const { ok } = await v.json()
        if (ok) {
          await setDoc(
            doc(db, 'sellers', user.uid),
            { isActive: true, activatedAt: serverTimestamp(), plan: name, fee: amount },
            { merge: true }
          )
          setStatus('done')
        }
      },
    })
  }

  if (loading) return <Page>Loading...</Page>

  if (status === 'done') {
    return (
      <Page title="Seller Onboarding">
        <div className="bg-white border rounded-xl p-6">
          <p>Your seller profile is active. Proceed to your dashboard.</p>
          <a className="mt-4 inline-block px-5 py-3 rounded-xl bg-gray-900 text-white" href="/seller/dashboard">
            Go to Dashboard
          </a>
        </div>
      </Page>
    )
  }

  return (
    <Page title="Seller Onboarding">
      {status === 'profile' && (
        <form onSubmit={saveProfile} className="max-w-md bg-white border rounded-xl p-4 space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white">Save & Continue</button>
        </form>
      )}

      {status === 'payment' && (
        <div className="max-w-md bg-white border rounded-xl p-4">
          <p className="mb-3">Pay a one-time registration fee to activate selling.</p>
          <button onClick={payAndActivate} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Pay & Activate
          </button>
        </div>
      )}
    </Page>
  )
}
