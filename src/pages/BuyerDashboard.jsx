import Page from '../components/Page'
import { useAuth } from '../context/AuthContext'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function BuyerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    (async () => {
      const q = query(
        collection(db, 'orders'),
        where('buyerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(q)
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })()
  }, [user])

  const totalSpent = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const completed = orders.filter(o => o.status === 'paid').length

  return (
    <Page title="Buyer Dashboard">
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <div className="text-2xl font-bold">{orders.length}</div>
          <div className="text-gray-600">Purchases</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-2xl font-bold">₹{(totalSpent / 100).toFixed(2)}</div>
          <div className="text-gray-600">Total Spent</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-2xl font-bold">{completed}</div>
          <div className="text-gray-600">Completed</div>
        </div>
      </div>

      {/* Table */}
      <h2 className="mt-8 mb-3 text-lg font-semibold">Purchase History</h2>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Order</th>
              <th className="text-left p-3">Photo</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">License</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.paymentId || o.id}</td>
                <td className="p-3">{o.photoId}</td>
                <td className="p-3">₹{((o.amount || 0) / 100).toFixed(2)}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">
                  {o.status === 'paid' ? (
                    <Link className="underline" to={`/license/${o.id}`}>
                      View License
                    </Link>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={5}>
                  No purchases yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Page>
  )
}
