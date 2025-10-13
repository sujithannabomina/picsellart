import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function BuyerLogin() {
  const { loginBuyer } = useAuth()
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Buyer Login / Sign Up</h1>
      {err && <p className="text-red-600 mb-4">{err}</p>}
      <button
        onClick={async () => {
          setErr(''); setBusy(true)
          try { await loginBuyer(); navigate('/buyer/dashboard') }
          catch (e) { setErr(e?.message || 'Login failed.') }
          finally { setBusy(false) }
        }}
        disabled={busy}
        className="bg-slate-900 text-white px-6 py-3 rounded-lg disabled:opacity-60"
      >
        {busy ? 'Signing in…' : 'Continue with Google'}
      </button>
    </div>
  )
}
