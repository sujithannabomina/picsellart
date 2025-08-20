import Page from '../components/Page'
import StatsCard from '../components/StatsCard'
import { useAuth } from '../context/AuthContext'
import { db, storage } from '../firebase'
import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getPlanConfig, isExpired } from '../utils/plans'

export default function SellerDashboard() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('street,city')
  const [price, setPrice] = useState(10000) // paise
  const [file, setFile] = useState(null)
  const [stats, setStats] = useState({ uploads: 0, earnings: 0, sold: 0 })
  const [myPhotos, setMyPhotos] = useState([])
  const [planInfo, setPlanInfo] = useState({ id: 'starter', activatedAt: null })

  async function refresh() {
    // load seller profile
    const sref = doc(db, 'sellers', user.uid)
    const ss = await getDoc(sref)
    const planId = ss.exists() ? (ss.data().plan || 'starter') : 'starter'
    const activatedAt = ss.exists() ? ss.data().activatedAt : null
    setPlanInfo({ id: planId, activatedAt })

    const q = query(
      collection(db, 'photos'),
      where('sellerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    setMyPhotos(arr)
    const sold = arr.reduce((s, p) => s + (p.salesCount || 0), 0)
    const earnings = arr.reduce((s, p) => s + ((p.salesCount || 0) * (p.price || 0) * 0.90), 0) // 10% commission retained
    setStats({ uploads: arr.length, earnings, sold })
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function uploadPhoto(e) {
    e.preventDefault()
    const plan = getPlanConfig(planInfo.id)
    const expired = isExpired(planInfo.activatedAt)
    if (expired) { alert('Your plan expired. Please renew to upload.'); return }
    if (myPhotos.length >= plan.uploadLimit) { alert('Upload limit reached for your plan.'); return }
    if (Number(price) < plan.minPrice || Number(price) > plan.maxPrice) {
      alert(`Price must be between ₹${plan.minPrice/100} and ₹${plan.maxPrice/100} for your plan.`)
      return
    }
    if (!file) return

    const path = `uploads/seller/${user.uid}/${Date.now()}_${file.name}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    await addDoc(collection(db, 'photos'), {
      sellerId: user.uid,
      title,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      price: Number(price), // paise
      url,
      storagePath: path,
      createdAt: serverTimestamp(),
      salesCount: 0,
    })
    setTitle(''); setTags('street,city'); setPrice(plan.minPrice); setFile(null)
    await refresh()
  }

  const plan = getPlanConfig(planInfo.id)
  const expired = isExpired(planInfo.activatedAt)
  const uploadsLeft = Math.max(0, plan.uploadLimit - myPhotos.length)

  return (
    <Page title="Seller Dashboard">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatsCard label="Uploads" value={stats.uploads} />
        <StatsCard label="Items Sold" value={stats.sold} />
        <StatsCard label="Earnings (after 10%)" value={`₹${(stats.earnings / 100).toFixed(2)}`} />
      </div>

      <div className="mt-4 p-4 card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="font-medium">Plan: {plan.name}</div>
            <div className="text-sm text-gray-600">
              {expired ? 'Expired' : 'Active'} • Uploads left: {uploadsLeft} • Price range: ₹{plan.minPrice/100}–₹{plan.maxPrice/100}
            </div>
          </div>
          <a className="btn bg-blue-600 text-white hover:bg-blue-700" href="/seller/start">Change / Renew</a>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold">Upload New Photo</h2>
      <form onSubmit={uploadPhoto} className="bg-white border rounded-xl p-4 grid sm:grid-cols-2 gap-3">
        <input className="border rounded-lg px-3 py-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input className="border rounded-lg px-3 py-2" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
        <input className="border rounded-lg px-3 py-2" type="number" placeholder={`Price (${plan.minPrice/100}-${plan.maxPrice/100})`} value={price}
               onChange={e => setPrice(e.target.value)} min={plan.minPrice} max={plan.maxPrice} required />
        <input className="border rounded-lg px-3 py-2" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
        <button type="submit" className="sm:col-span-2 px-4 py-2 rounded-lg bg-gray-900 text-white" disabled={expired || uploadsLeft <= 0}>
          {expired ? 'Plan expired — renew to upload' : 'Upload'}
        </button>
      </form>

      <h2 className="mt-8 mb-3 text-lg font-semibold">Your Photos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {myPhotos.map(p => (
          <div key={p.id} className="bg-white border rounded-xl overflow-hidden">
            <div className="relative">
              {/* preview uses screen watermark; original is kept for buyers */}
              <img src={p.url} alt={p.title} className="w-full h-48 object-cover" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-white/30 font-extrabold rotate-[-25deg] text-4xl select-none">picsellart</span>
              </div>
            </div>
            <div className="p-3">
              <div className="text-sm text-gray-500">{p.tags?.join(', ')}</div>
              <div className="flex items-center justify-between">
                <div className="font-medium">{p.title}</div>
                <div className="font-semibold">₹{(p.price / 100).toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
        {myPhotos.length === 0 && (
          <div className="text-gray-500">No uploads yet.</div>
        )}
      </div>
    </Page>
  )
}
