import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Page from '../components/Page'
import WatermarkedImage from '../components/WatermarkedImage'
import { db } from '../firebase'
import {
  doc, getDoc, serverTimestamp, addDoc, collection,
  getDocs, query, where, deleteDoc
} from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { openCheckout } from '../utils/razorpay'

export default function PhotoDetails() {
  const { photoId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile } = useAuth()

  // If we arrived via <Link state={{ photo }} />, we can avoid a fetch and also
  // show sample photos that aren't in Firestore.
  const statePhoto = location.state?.photo
  const [photo, setPhoto] = useState(statePhoto || null)
  const [loading, setLoading] = useState(!statePhoto)
  const [orders, setOrders] = useState([])
  const [liked, setLiked] = useState(false)
  const [likeDocId, setLikeDocId] = useState(null)

  const canDownload = useMemo(
    () => orders.some(o => o.status === 'paid'),
    [orders]
  )

  useEffect(() => {
    if (statePhoto) return
    ;(async () => {
      const snap = await getDoc(doc(db, 'photos', photoId))
      if (snap.exists()) setPhoto({ id: snap.id, ...snap.data() })
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoId])

  // Load purchase + like state for this user
  useEffect(() => {
    if (!user) return
    ;(async () => {
      const oq = query(collection(db, 'orders'),
        where('buyerId', '==', user.uid),
        where('photoId', '==', photoId)
      )
      const os = await getDocs(oq)
      setOrders(os.docs.map(d => ({ id: d.id, ...d.data() })))

      const lq = query(collection(db, 'likes'),
        where('uid', '==', user.uid),
        where('photoId', '==', photoId)
      )
      const ls = await getDocs(lq)
      if (!ls.empty) {
        setLiked(true)
        setLikeDocId(ls.docs[0].id)
      } else {
        setLiked(false)
        setLikeDocId(null)
      }
    })()
  }, [user, photoId])

  async function toggleLike() {
    if (!user) {
      navigate('/buyer/login', { state: { from: location }, replace: true })
      return
    }
    if (liked && likeDocId) {
      await deleteDoc(doc(db, 'likes', likeDocId))
      setLiked(false)
      setLikeDocId(null)
      return
    }
    const ref = await addDoc(collection(db, 'likes'), {
      uid: user.uid,
      photoId,
      createdAt: serverTimestamp(),
    })
    setLiked(true)
    setLikeDocId(ref.id)
  }

  async function handleBuyOrDownload() {
    // If no price (e.g., sample image) we don't sell it.
    if (!photo?.price) return

    if (!user || profile?.role !== 'buyer') {
      navigate('/buyer/login', { state: { from: location }, replace: true })
      return
    }
    // Already purchased → download
    if (canDownload) {
      const a = document.createElement('a')
      a.href = photo.url
      a.download = `${photo.title || 'photo'}.jpg`
      document.body.appendChild(a)
      a.click()
      a.remove()
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
        <WatermarkedImage src={photo.url} alt={photo.title} className="w-full rounded-xl border h-[22rem]" />
        <div>
          <h1 className="text-2xl font-semibold">{photo.title || 'Street Photography'}</h1>
          <div className="text-gray-500 mt-1">{photo.tags?.join(', ')}</div>
          {photo.price ? (
            <div className="mt-4 text-3xl font-bold">₹{(photo.price / 100).toFixed(2)}</div>
          ) : (
            <div className="mt-4 text-sm text-gray-500">Sample photo (not for purchase)</div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={toggleLike}
              className={`btn ${liked ? 'bg-pink-600 text-white hover:bg-pink-700' : 'btn-outline'}`}
              aria-pressed={liked}
            >
              {liked ? '♥ Liked' : '♡ Like'}
            </button>

            <button
              onClick={handleBuyOrDownload}
              className={`btn ${photo.price ? (canDownload ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'btn-primary') : 'btn-outline cursor-not-allowed opacity-60'}`}
              disabled={!photo.price}
            >
              {photo.price ? (canDownload ? 'Download' : 'Buy & Download') : 'Not for sale'}
            </button>
          </div>

          {!user && (
            <p className="mt-3 text-sm text-gray-500">
              Log in to save likes. Buying will ask you to log in first.
            </p>
          )}
        </div>
      </div>
    </Page>
  )
}
