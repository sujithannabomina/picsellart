import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Page from '../components/Page'
import { db } from '../firebase'
import { doc, getDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { openCheckout } from '../utils/razorpay'

export default function PhotoDetails() {
  const { photoId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile } = useAuth()
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      // Samples are not purchasable; redirect back to Explore
      if (photoId.startsWith('sample-')) {
        navigate('/explore', { replace: true })
        return
      }
      const snap = await getDoc(doc(db, 'photos', photoId))
      if (snap.exists()) {
        setPhoto({ id: snap.id, ...snap.data() })
      }
      setLoading(false)
    })()
  }, [photoId, navigate])

  async function handleBuy() {
    if (!user || profile?.role !== 'buyer') {
      navigate('/buyer/login', { state: { from: location }, replace: true })
      return
    }

    // Create order on server
    const res = await fetch('/api/createOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: photo.price,
        receipt: `photo_${photo.id}_${Date.now()}`
      })
    })
    const { orderId } = await res.json()

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID
    await openCheckout({
      key,
      amount: photo.price,
      name: 'Picsellart',
      description: photo.title,
      orderId,
      prefill: { email: user.email },
      notes: { photoId: photo.id },
      handler: async (resp) => {
        // Verify signature
        const v = await fetch('/api/verifyPayment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, ...resp })
        })
        const { ok } = await v.json()
        if (ok) {
          await addDoc(collection(db, 'orders'), {
            buyerId: user.uid,
            photoId: photo.id,
            amount: photo.price,
            paymentId: resp.razorpay_payment_id,
            createdAt: serverTimestamp(),
            status: 'paid'
          })
          navigate('/buyer/dashboard', { replace: true })
        }
      }
    })
  }

  if (loading || !photo) return <Page>Loading...</Page>

  return (
    <Page>
      <div className="grid md:grid-cols-2 gap-6">
        <img src={photo.url} alt={photo.title} className="w-full rounded-xl border" />
        <div>
          <h1 className="text-2xl font-semibold">{photo.title}</h1>
          <div className="text-gray-500 mt-1">{photo.tags?.join(', ')}</div>
          <div className="mt-4 text-3xl font-bold">₹{(photo.price / 100).toFixed(2)}</div>
          <button
            onClick={handleBuy}
            className="mt-6 px-5 py-3 rounded-xl bg-gray-900 text-white"
          >
            Buy Now
          </button>
        </div>
      </div>
    </Page>
  )
}
