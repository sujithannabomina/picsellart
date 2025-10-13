import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { Link } from 'react-router-dom'

export default function BuyerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, 'orders'),
        where('buyerUid', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      )
      const snap = await getDocs(q)
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })()
  }, [user])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
        <Link to="/settings" className="px-3 py-2 rounded border">Account Settings</Link>
      </div>
      {loading ? <p>Loading…</p> : (
        orders.length ? (
          <div className="grid gap-4">
            {orders.map(o => (
              <div key={o.id} className="rounded-xl border p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{o.photoTitle || 'Photo'}</div>
                  <div className="text-sm text-slate-600">₹{Number(o.amount || 0).toFixed(2)} · {o.currency}</div>
                </div>
                <a href={o.downloadUrl} className="px-3 py-2 rounded bg-black text-white" target="_blank">Download</a>
              </div>
            ))}
          </div>
        ) : <p className="text-slate-600">No purchases yet.</p>
      )}
    </div>
  )
}
