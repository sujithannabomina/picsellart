import { useEffect, useMemo, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore'
import { storage, db, serverTs } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function SellerDashboard() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(199)
  const [category, setCategory] = useState('general')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [mine, setMine] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    // Photos
    const qp = query(collection(db, 'photos'), where('ownerUid', '==', user.uid), orderBy('createdAt', 'desc'), limit(50))
    const snapP = await getDocs(qp)
    setMine(snapP.docs.map(d => ({ id: d.id, ...d.data() })))

    // Sales (orders)
    const qs = query(collection(db, 'orders'), where('sellerUid', '==', user.uid), orderBy('createdAt', 'desc'), limit(50))
    const snapS = await getDocs(qs)
    setSales(snapS.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const totalEarnings = useMemo(() => sales.reduce((sum, s) => sum + Number(s.amount || 0), 0), [sales])

  const upload = async (e) => {
    e.preventDefault()
    if (!file) return
    setBusy(true)
    try {
      const storagePath = `photos/${user.uid}/${Date.now()}-${file.name}`
      const r = ref(storage, storagePath)
      await uploadBytes(r, file)
      const url = await getDownloadURL(r)

      await addDoc(collection(db, 'photos'), {
        ownerUid: user.uid,
        title: title || file.name,
        category,
        price: Number(price),
        storagePath,
        url,
        thumbnailUrl: url,
        createdAt: serverTs(),
      })
      setTitle(''); setFile(null)
      await fetchAll()
      alert('Uploaded!')
    } catch (err) {
      alert(err?.message || 'Upload failed')
    } finally { setBusy(false) }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <Link to="/settings" className="px-3 py-2 rounded border">Account Settings</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border p-4">
          <div className="text-slate-600 text-sm">Total Sales</div>
          <div className="text-3xl font-bold">₹{totalEarnings.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-slate-600 text-sm">Orders</div>
          <div className="text-3xl font-bold">{sales.length}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-slate-600 text-sm">Photos</div>
          <div className="text-3xl font-bold">{mine.length}</div>
        </div>
      </div>

      <form onSubmit={upload} className="rounded-xl border p-4 grid md:grid-cols-5 gap-3 mb-8">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border rounded px-3 py-2 md:col-span-2" />
        <input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="border rounded px-3 py-2" min="0" step="1" />
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="border rounded px-3 py-2" />
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} className="md:col-span-2" />
        <button disabled={busy || !file} className="bg-black text-white px-4 py-2 rounded md:col-span-1">
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      <h2 className="font-semibold mb-3">Your Photos</h2>
      {loading ? <p>Loading…</p> : (
        mine.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {mine.map(p => (
              <a href={p.url} target="_blank" key={p.id} className="rounded-2xl overflow-hidden shadow">
                <img src={p.thumbnailUrl || p.url} alt={p.title} className="w-full h-56 object-cover" />
                <div className="p-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-slate-600">₹{Number(p.price || 0).toFixed(2)}</div>
                </div>
              </a>
            ))}
          </div>
        ) : <p className="text-slate-600">No photos yet. Upload your first image above.</p>
      )}

      <h2 className="font-semibold mt-10 mb-3">Recent Orders</h2>
      {sales.length ? (
        <div className="grid gap-3">
          {sales.map(o => (
            <div key={o.id} className="rounded-xl border p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{o.photoTitle || 'Photo'}</div>
                <div className="text-sm text-slate-600">₹{Number(o.amount || 0).toFixed(2)} · {o.currency}</div>
              </div>
              <a href={o.downloadUrl} target="_blank" className="px-3 py-2 rounded border">View</a>
            </div>
          ))}
        </div>
      ) : <p className="text-slate-600">No sales yet.</p>}
    </div>
  )
}
