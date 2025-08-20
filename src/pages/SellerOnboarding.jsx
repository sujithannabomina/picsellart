import Page from '../components/Page'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { openCheckout } from '../utils/razorpay'
import { getPlanConfig } from '../utils/plans'

export default function SellerOnboarding() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [upi, setUpi] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNo, setAccountNo] = useState('')
  const [ifsc, setIfsc] = useState('')
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
        email: user.email,
        displayName,
        phone,
        payout: { upi, bankName, accountNo, ifsc }, // capture payout details
        isActive: false,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    )
    setStatus('payment')
  }

  function resolvePlan() {
    const selectedId = localStorage.getItem('seller_plan_id') || 'starter'
    const p = getPlanConfig(selectedId)
    return p
  }

  async function payAndActivate() {
    const plan = resolvePlan()
    const res = await fetch('/api/createOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: plan.amount, receipt: `seller_${user.uid}_${Date.now()}` }),
    })
    const { orderId } = await res.json()

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID
    await openCheckout({
      key,
      amount: plan.amount,
      name: `Picsellart ${plan.name}`,
      description: 'One-year seller plan',
      orderId,
      prefill: { email: user.email },
      notes: { sellerId: user.uid, planId: plan.id },
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
            { isActive: true, plan: plan.id, activatedAt: serverTimestamp() },
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
          <p>Your seller profile is active for one year. You can now upload and sell.</p>
          <a className="mt-4 inline-block px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700" href="/seller/dashboard">
            Go to Dashboard
          </a>
        </div>
      </Page>
    )
  }

  return (
    <Page title="Seller Onboarding">
      {status === 'profile' && (
        <form onSubmit={saveProfile} className="max-w-xl bg-white border rounded-xl p-4 grid gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Display Name" value={displayName} onChange={(e)=>setDisplayName(e.target.value)} required />
          <input className="border rounded-lg px-3 py-2" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
          {/* Payout details */}
          <input className="border rounded-lg px-3 py-2" placeholder="UPI ID (preferred)" value={upi} onChange={(e)=>setUpi(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="Bank Name (optional)" value={bankName} onChange={(e)=>setBankName(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="Account Number (optional)" value={accountNo} onChange={(e)=>setAccountNo(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="IFSC (optional)" value={ifsc} onChange={(e)=>setIfsc(e.target.value)} />
          <button className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white">Save & Continue</button>
        </form>
      )}

      {status === 'payment' && (
        <div className="max-w-md bg-white border rounded-xl p-4">
          <p className="mb-3">Pay the selected plan to activate your seller account for one year.</p>
          <button onClick={payAndActivate} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Pay & Activate
          </button>
        </div>
      )}
    </Page>
  )
}
