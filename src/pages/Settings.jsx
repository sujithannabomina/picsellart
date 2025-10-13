import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { db, serverTs } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function Settings() {
  const { user, role } = useAuth()
  const [name, setName] = useState(user?.displayName || '')
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState('')

  const save = async () => {
    setBusy(true); setOk('')
    try {
      await setDoc(doc(db, 'users', user.uid), {
        role: role || 'buyer',
        email: user.email || '',
        displayName: name || '',
        updatedAt: serverTs(),
      }, { merge: true })
      setOk('Saved!')
    } catch (e) {
      setOk(e?.message || 'Failed')
    } finally { setBusy(false) }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-slate-600">Email</div>
          <div className="font-medium">{user?.email}</div>
        </div>
        <div>
          <div className="text-sm text-slate-600">Role</div>
          <div className="font-medium capitalize">{role || '—'}</div>
        </div>
        <div>
          <label className="text-sm text-slate-600">Display Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="border rounded w-full px-3 py-2 mt-1" />
        </div>
        <button onClick={save} disabled={busy} className="bg-black text-white px-4 py-2 rounded">
          {busy ? 'Saving…' : 'Save'}
        </button>
        {ok && <div className="text-sm text-slate-600">{ok}</div>}
      </div>
    </div>
  )
}
