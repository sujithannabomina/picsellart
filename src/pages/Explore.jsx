import { useEffect, useMemo, useState } from 'react'
import Page from '../components/Page'
import ImageCard from '../components/ImageCard'
import { loadSamplePhotos, loadSellerPhotos } from '../utils/storage'

function interleave(a, b) {
  const out = []
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i++) {
    if (a[i]) out.push(a[i])
    if (b[i]) out.push(b[i])
  }
  return out
}

export default function Explore() {
  const [allPhotos, setAllPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 24

  useEffect(() => {
    (async () => {
      const [samples, sellers] = await Promise.all([
        loadSamplePhotos(),
        loadSellerPhotos(),
      ])
      setAllPhotos(interleave(sellers, samples))
      setLoading(false)
    })()
  }, [])

  // Filter by query
  const filtered = useMemo(() => {
    if (!q.trim()) return allPhotos
    const s = q.toLowerCase()
    return allPhotos.filter(p =>
      (p.title || '').toLowerCase().includes(s) ||
      (p.tags || []).join(',').toLowerCase().includes(s)
    )
  }, [allPhotos, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [q]) // reset page when searching

  return (
    <Page title="Explore Pictures">
      {/* Search bar */}
      <div className="mb-6 flex items-center gap-2">
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Search by title or tags…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {current.map(p => <ImageCard key={p.id} photo={p} />)}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              className="btn btn-outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </Page>
  )
}
