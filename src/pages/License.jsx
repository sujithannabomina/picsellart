import Page from '../components/Page'
import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export default function License() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const os = await getDoc(doc(db, 'orders', orderId))
        if (os.exists()) {
          const o = os.data()
          setOrder({ id: os.id, ...o })
          if (o.photoId) {
            const ps = await getDoc(doc(db, 'photos', o.photoId))
            if (ps.exists()) setPhoto({ id: ps.id, ...ps.data() })
          }
        }
      } catch (e) {
        console.error('Failed to load license:', e)
      }
    })()
  }, [orderId])

  if (!order) return <Page>Loading...</Page>

  const issuedOn =
    order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : ''

  return (
    <Page title="License Certificate">
      <div className="bg-white border rounded-xl p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">Picsellart Personal Use License</h2>
        <p className="text-sm text-gray-600 mb-4">
          Order: {order.paymentId || order.id} • Issued: {issuedOn}
        </p>
        <p className="mb-3">
          <span className="font-medium">Work:</span> {photo?.title || order.photoId}
        </p>
        <p className="mb-3">
          <span className="font-medium">Licensee:</span> {order.buyerId}
        </p>
        <p className="mb-3">
          <span className="font-medium">Scope:</span> Non-exclusive, non-transferable license for personal use only (web/social posts, personal
          prints). Commercial use, resale, redistribution, or sublicensing is not permitted.
        </p>
        <p className="mb-6">
          For extended or commercial licenses, please contact support@picsellart.in.
        </p>
        <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-gray-900 text-white">
          Print / Save PDF
        </button>
      </div>
    </Page>
  )
}
