import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function SellerDashboard() {
  const { user, role, loading } = useAuth()
  const nav = useNavigate()
  const [photos, setPhotos] = useState([])
  const [sales, setSales] = useState([])
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) return nav('/seller/login')
    if (role !== 'seller') return nav('/') // block buyers

    ;(async () => {
      try {
        const q1 = query(collection(db, 'photos'), where('sellerUid', '==', user.uid))
        const q2 = query(collection(db, 'sales'), where('sellerUid', '==', user.uid))

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])
        setPhotos(snap1.docs.map(d => ({ id: d.id, ...d.data() })))
        setSales(snap2.docs.map(d => ({ id: d.id, ...d.data() })))
      } finally {
        setBusy(false)
      }
    })()
  }, [user, role, loading, nav])

  const earnings = useMemo(
    () => sales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0),
    [sales]
  )

  if (busy) return <div className="mx-auto max-w-6xl px-4 py-10">Loading…</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Seller Dashboard</h1>

      <section className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="text-sm text-gray-500">Uploads</div>
          <div className="text-3xl font-semibold mt-2">{photos.length}</div>
        </div>
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="text-sm text-gray-500">Sales</div>
          <div className="text-3xl font-semibold mt-2">{sales.length}</div>
        </div>
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="text-sm text-gray-500">Earnings</div>
          <div className="text-3xl font-semibold mt-2">₹{earnings.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="text-sm text-gray-500">Account</div>
          <div className="mt-2 break-all">{user?.email}</div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Uploads</h2>
          <a
            href="/seller/onboarding"
            className="px-4 py-2 rounded-md bg-black text-white"
          >
            Upload New
          </a>
        </div>

        {photos.length === 0 ? (
          <p className="text-gray-600">
            No uploads yet. Click <b>Upload New</b> to add your first photo.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {photos.map(ph => (
              <div key={ph.id} className="rounded-2xl border p-4 shadow-sm">
                <div className="font-medium">{ph.title ?? 'Untitled'}</div>
                <div className="text-sm text-gray-500">Price: ₹{ph.price ?? 0}</div>
                <div className="text-sm text-gray-500">Tags: {(ph.tags ?? []).join(', ')}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
        {sales.length === 0 ? (
          <p className="text-gray-600">No sales yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sales.map(s => (
              <div key={s.id} className="rounded-2xl border p-4 shadow-sm">
                <div className="font-medium">{s.title ?? 'Photo'}</div>
                <div className="text-sm text-gray-500">Order: {s.orderId}</div>
                <div className="text-sm text-gray-500">Amount: ₹{s.amount}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
