import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Page from '../components/Page'
import { auth } from '../firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth'

export default function BuyerLogin() {
  const nav = useNavigate()
  const loc = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const afterLoginPath =
    loc.state?.from?.pathname || '/buyer/dashboard' // if we came from Buy button, go back there

  async function doEmailLogin(e) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      nav(afterLoginPath, { replace: true })
    } catch (e) {
      setErr(e?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  async function doGoogle() {
    setErr('')
    setBusy(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      nav(afterLoginPath, { replace: true })
    } catch (e) {
      setErr(e?.message || 'Google sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Page title="Buyer Login / Sign Up">
      <form
        onSubmit={doEmailLogin}
        className="max-w-md mx-auto bg-white border rounded-2xl p-6 grid gap-3"
      >
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="btn bg-gray-900 text-white hover:bg-black disabled:opacity-60"
          type="submit"
          disabled={busy}
        >
          {busy ? 'Logging in…' : 'Login'}
        </button>

        <button
          type="button"
          onClick={doGoogle}
          className="btn btn-outline disabled:opacity-60"
          disabled={busy}
        >
          Continue with Google
        </button>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <div className="text-center text-sm text-gray-600">
          New here?{' '}
          <Link to="/buyer/signup" className="underline">
            Create an account
          </Link>
        </div>
      </form>
    </Page>
  )
}
