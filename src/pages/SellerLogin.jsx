// src/pages/SellerLogin.jsx
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db, serverTs } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SellerLogin() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const handleGoogle = async () => {
    try {
      setBusy(true);
      setErr('');
      const { user } = await signInWithPopup(auth, googleProvider);
      const ref = doc(db, 'profiles', user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          role: 'seller',
          createdAt: serverTs(),
          updatedAt: serverTs(),
          // you can initialize subscription fields here later
        });
      }
      // if the existing role is 'buyer', keep it — don’t silently flip

      nav('/seller/dashboard', { replace: true });
    } catch (e) {
      setErr(e.message || 'Sign in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-semibold mb-6">Seller Login / Sign Up</h1>
      {err && <div className="mb-4 text-red-600 text-sm">{err}</div>}
      <button onClick={handleGoogle} disabled={busy} className="btn btn-dark w-full">
        {busy ? 'Signing in…' : 'Continue with Google'}
      </button>
    </div>
  );
}
