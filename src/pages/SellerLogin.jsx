// src/pages/SellerLogin.jsx
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function SellerLogin() {
  const { user, signInSeller } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const u = user || (await signInSeller());
      const snap = await getDoc(doc(db, 'sellers', u.uid));
      const active = snap.exists() && snap.data()?.activePlan;
      navigate(active ? '/seller/dashboard' : '/seller/subscribe', { replace: true });
    })();
  }, [user]);

  return <div className="max-w-3xl mx-auto px-4 py-10">Signing you in…</div>;
}
