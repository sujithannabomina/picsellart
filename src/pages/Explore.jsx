import { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore'
import { db } from '../firebase'
import { Link } from 'react-router-dom'

export default function Explore() {
  const PAGE = 9
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1)
  const [cursor, setCursor] = useState(null)
  const [end, setEnd] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchPage = async (reset=false) => {
    setLoading(true)
    let q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'), limit(PAGE))
    if (!reset && cursor) q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'), startAfter(cursor), limit(PAGE))
    const snap = await getDocs(q)
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    setPhotos(rows)
    setCursor(snap.docs[snap.docs.length - 1] || null)
    setEnd(snap.size < PAGE)
    setLoading(false)
  }

  useEffect(() => { fetchPage(true) }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Explore Pictures</h1>
      {loading ? <p>Loading…</p> : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            {photos.map(p => (
              <Link to={`/photo/${p.id}`} key={p.id} className="rounded-2xl overflow-hidden shadow">
                <img src={p.thumbnailUrl || p.url} alt={p.title} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="font-medium">{p.title || 'Untitled'}</h3>
                  <div className="text-sm text-slate-600">₹{Number(p.price || 0).toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              className="px-4 py-2 rounded border"
              onClick={() => { setPage(p => Math.max(1, p-1)); /* simple visual pager */ }}
              disabled={page === 1}
            >Previous</button>
            <span>Page {page}</span>
            <button
              className="px-4 py-2 rounded border"
              onClick={() => { setPage(p => p+1); fetchPage() }}
              disabled={end}
            >Next</button>
          </div>
        </>
      )}
    </div>
  )
}
