import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { loadRazorpay, openCheckout } from '../utils/razorpay'

export default function PhotoDetails() {
  const { id } = useParams()
  const [photo, setPhoto] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const { user, role } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { loadRazorpay() }, [])
  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'photos', id))
      if (snap.exists()) setPhoto({ id: snap.id, ...snap.data() })
    })()
  }, [id])

  const buy = async () => {
    if (!user) return navigate('/buyer/login')
    setErr(''); setBusy(true)
    try {
      const amount = Number(photo.price || 0)
      // 1) create order
      const resp = await fetch('/api/createOrder', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'purchase',
          amount,
          currency: 'INR',
          meta: { photoId: photo.id, sellerUid: photo.ownerUid, buyerUid: user.uid },
        }),
      })
      const { order, keyId, error } = await resp.json()
      if (error) throw new Error(error)

      // 2) open checkout
      await openCheckout({
        key: keyId,
        amount,
        name: 'Picsellart',
        description: photo.title || 'Photo',
        orderId: order?.id,
        prefill: { name: user.displayName || '', email: user.email || '' },
        notes: { photoId: photo.id, sellerUid: photo.ownerUid, buyerUid: user.uid },
        handler: async (rzpRes) => {
          // 3) verify
          const ver = await fetch('/api/verifyPayment', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...rzpRes, meta: { photoId: photo.id, buyerUid: user.uid } }),
          })
          const v = await ver.json()
          if (!v.ok) throw new Error(v.error || 'Verification failed')

          // 4) create Firestore order (buyer & seller can see it by rules)
          await addDoc(collection(db, 'orders'), {
            buyerUid: user.uid,
            sellerUid: photo.ownerUid,
            photoId: photo.id,
            photoTitle: photo.title || '',
            amount,
            currency: 'INR',
            downloadUrl: photo.url, // Optional: switch to signed URL later
            createdAt: serverTimestamp(),
            paymentId: rzpRes.razorpay_payment_id,
            orderId: rzpRes.razorpay_order_id,
          })
          alert('Purchase successful! Find it in your dashboard.')
          navigate('/buyer/dashboard')
        },
      })
    } catch (e) {
      setErr(e?.message || 'Payment failed')
    } finally { setBusy(false) }
  }

  if (!photo) return <div className="max-w-6xl mx-auto px-4 py-10">Loading…</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <img src={photo.url} alt={photo.title} className="w-full rounded-2xl shadow" />
        <div>
          <h1 className="text-3xl font-bold mb-2">{photo.title}</h1>
          <p className="text-slate-600 mb-4 capitalize">{photo.category}</p>
          <div className="text-2xl font-semibold mb-6">₹{Number(photo.price || 0).toFixed(2)}</div>
          {err && <p className="text-red-600 mb-3">{err}</p>}
          <div className="flex gap-3">
            <button onClick={buy} disabled={busy} className="bg-black text-white px-6 py-3 rounded-lg">
              {busy ? 'Processing…' : 'Buy & Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
