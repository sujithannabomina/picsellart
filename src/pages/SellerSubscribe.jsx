import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Page from '../components/Page'
import { useAuth } from '../context/AuthContext'
import { PLANS, getPlanConfig } from '../utils/plans'
import { db, serverTs } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function SellerSubscribe() {
  const { search } = useLocation()
  const nav = useNavigate()
  const { user, role, loading } = useAuth()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const planKey = new URLSearchParams(search).get('plan') || 'starter'
  const plan = useMemo(() => getPlanConfig(planKey), [planKey])

  useEffect(() => {
    if (loading) return
    if (!user) { nav('/seller/login', { replace: true }); return }
    if (role !== 'seller') { nav('/seller/onboarding', { replace: true }); return }
  }, [user, role, loading])

  async function pay() {
    setErr('')
    setBusy(true)
    try {
      // create an order (amount in paise)
      const receipt = `sub_${user.uid}_${Date.now()}`
      const res = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: plan.amount, receipt })
      })
      const { orderId, error } = await res.json()
      if (!orderId) throw new Error(error || 'Failed to create order')

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID
      const rzp = new window.Razorpay({
        key,
        amount: plan.amount,
        currency: 'INR',
        name: 'Picsellart',
        description: `${plan.label} seller plan`,
        order_id: orderId,
        handler: async (resp) => {
          const v = await fetch('/api/verifyPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resp)
          })
          const ok = await v.json()
          if (!ok.ok) { setErr('Payment verification failed'); setBusy(false); return }

          // write subscription
          const ref = doc(db, 'users', user.uid)
          const snap = await getDoc(ref)
          const cur = snap.exists() ? snap.data() : { role: 'seller' }
          const now = Date.now()
          const oneYear = 365 * 24 * 60 * 60 * 1000
          const sub = {
            plan: plan.key,
            startsAt: now,
            expiresAt: now + oneYear,
            uploadsAllowed: plan.uploads,
            uploadsUsed: cur?.subscription?.uploadsUsed || 0,
            minPrice: plan.min,
            maxPrice: plan.max,
            orderId: orderId,
            paymentId: resp.razorpay_payment_id,
            createdAt: serverTs(),
          }
          await setDoc(ref, { ...cur, subscription: sub }, { merge: true })
          nav('/seller/dashboard', { replace: true })
        },
        prefill: {
          email: user.email || '',
          name: user.displayName || ''
        },
        theme: { color: '#1f2937' }
      })
      rzp.open()
    } catch (e) {
      setErr(e?.message || 'Payment failed to init')
    } finally {
      // busy is turned off after handler or error
    }
  }

  return (
    <Page title="Subscribe to a Seller Plan">
      <div className="max-w-lg mx-auto border rounded-2xl p-6">
        <div className="text-2xl font-semibold">{plan.label} Plan</div>
        <div className="text-3xl font-bold mt-2">₹{(plan.amount/100).toFixed(2)}</div>
        <ul className="mt-4 text-gray-700 space-y-2">
          <li>{plan.uploads} photo uploads</li>
          <li>Set price between ₹{plan.min}–₹{plan.max}</li>
          <li>Valid for 1 year</li>
        </ul>
        <div className="mt-6 flex gap-3">
          <button className="btn bg-blue-600 text-white" onClick={pay} disabled={busy}>
            {busy ? 'Opening checkout…' : 'Pay & Activate'}
          </button>
          <button className="btn btn-outline" onClick={() => nav('/seller/start')}>Back</button>
        </div>
        {err && <div className="text-red-600 mt-4 text-sm">{err}</div>}
      </div>
    </Page>
  )
}
