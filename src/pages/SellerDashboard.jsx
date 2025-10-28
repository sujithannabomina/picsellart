// src/pages/SellerDashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/seller', { replace: true });
    (async () => {
      const snap = await getDoc(doc(db, 'sellers', user.uid));
      setPlan(snap.exists() ? snap.data() : null);
    })();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      <div className="mt-3 text-slate-600">Welcome, {user.displayName || user.email}</div>

      <div className="mt-6 rounded-xl border p-4">
        <div className="font-semibold">Plan status</div>
        <div className="text-slate-700">
          {plan?.activePlan ? 'Active' : 'Not active'}
        </div>
        {!plan?.activePlan && (
          <Link
            to="/seller/subscribe"
            className="mt-3 inline-block px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Subscribe now
          </Link>
        )}
      </div>

      <div className="mt-6">
        <Link
          to="/seller/upload"
          className="px-4 py-2 rounded-full border hover:bg-gray-50"
        >
          Upload Photos
        </Link>
      </div>
    </div>
  );
}
