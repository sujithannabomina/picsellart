import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function BuyerDashboard() {
  const { user, role, loading } = useAuth()
  const nav = useNavigate()
  const [purchases, setPurchases] = useState([])
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) return nav('/buyer/login')
    if (role !== 'buyer') return nav('/') // block sellers

    (async () => {
      try {
        const q = query(
          collection(db, 'purchases'),
          where('buyerUid', '==', user.uid)
        )
        const snap = await getDocs(q)
        setPurchases(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } finally {
        setBusy(false)
      }
    })()
  }, [user, role, loading, nav])

  if (busy) {
    return <div className="mx-auto max-w-6xl px-4 py-10">Loading…</div>
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Buyer Dashboard</h1>

      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="text-sm text-gray-500">Total Purchases</div>
          <div className="text-3xl font-semibold mt-2">{purchases.length}</div>
        </div>
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="text-sm text-gray-500">Account</div>
          <div className="mt-2 break-all">{user?.email}</div>
        </div>
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="text-sm text-gray-500">Settings</div>
          <div className="mt-2">
            Coming soon: profile photo, display name, invoice history.
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
        {purchases.length === 0 ? (
          <p className="text-gray-600">No purchases yet. Browse the <a href="/explore" className="underline">Explore</a> page.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchases.map(p => (
              <div key={p.id} className="rounded-2xl border p-4 shadow-sm">
                <div className="font-medium">{p.title ?? 'Photo'}</div>
                <div className="text-sm text-gray-500">Order: {p.orderId}</div>
                <div className="text-sm text-gray-500">Amount: ₹{p.amount}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
