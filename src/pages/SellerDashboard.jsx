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
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function SellerDashboard() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('street,city')
  const [price, setPrice] = useState(19900)
  const [file, setFile] = useState(null)
  const [stats, setStats] = useState({ uploads: 0, earnings: 0, sold: 0 })
  const [myPhotos, setMyPhotos] = useState([])

  async function refresh() {
    const q = query(
      collection(db, 'photos'),
      where('sellerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    setMyPhotos(arr)
    const sold = arr.reduce((s, p) => s + (p.salesCount || 0), 0)
    const earnings = arr.reduce(
      (s, p) => s + ((p.salesCount || 0) * (p.price || 0)),
      0
    )
    setStats({ uploads: arr.length, earnings, sold })
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function uploadPhoto(e) {
    e.preventDefault()
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
    setTitle('')
    setTags('street,city')
    setPrice(19900)
    setFile(null)
    await refresh()
  }

  return (
    <Page title="Seller Dashboard">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatsCard label="Uploads" value={stats.uploads} />
        <StatsCard label="Items Sold" value={stats.sold} />
        <StatsCard label="Total Earnings" value={`₹${(stats.earnings / 100).toFixed(2)}`} />
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold">Upload New Photo</h2>
      <form onSubmit={uploadPhoto} className="bg-white border rounded-xl p-4 grid sm:grid-cols-2 gap-3">
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2"
          type="number"
          placeholder="Price (paise)"
          value={price}
          onChange={e => setPrice(e.target.value)}
          min={0}
          required
        />
        <input
          className="border rounded-lg px-3 py-2"
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
          required
        />
        <button type="submit" className="sm:col-span-2 px-4 py-2 rounded-lg bg-gray-900 text-white">
          Upload
        </button>
      </form>

      <h2 className="mt-8 mb-3 text-lg font-semibold">Your Photos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {myPhotos.map(p => (
          <div key={p.id} className="bg-white border rounded-xl overflow-hidden">
            <img src={p.url} alt={p.title} className="w-full h-48 object-cover" />
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
