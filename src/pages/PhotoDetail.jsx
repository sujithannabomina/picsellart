import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { watermark } from '../utils/watermark'

export default function PhotoDetail() {
  const { id } = useParams()
  const fullUrl = decodeURIComponent(id)
  const [wm, setWm] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, role } = useAuth()
  const loc = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    let canceled = false
    async function run() {
      try {
        const data = await watermark(fullUrl)
        if (!canceled) setWm(data)
      } finally {
        if (!canceled) setLoading(false)
      }
    }
    run()
    return () => { canceled = true }
  }, [fullUrl])

  const buyNow = async () => {
    if (!user || role !== 'buyer') {
      localStorage.setItem('postLoginRedirect', loc.pathname + '?buy=1')
      await window.authActions?.signInBuyer?.()
      return
    }
    alert('✅ Payment flow placeholder: integrate Razorpay checkout here and deliver original file after success.')
  }

  return (
    <main className="container">
      <h1 className="page-title">Photo</h1>
      {loading && <div className="hero-skel" />}
      {!loading && (
        <>
          <img src={wm} alt="preview" className="detail-img" />
          <div className="detail-actions">
            <button className="btn primary" onClick={buyNow}>Buy</button>
            <button className="btn pill" onClick={() => nav('/explore')}>Back to Explore</button>
          </div>
        </>
      )}
    </main>
  )
}
