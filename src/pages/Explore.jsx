// src/pages/Explore.jsx
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { loadRazorpay, createServerOrder, openCheckout } from '../utils/razorpay';
import { useNavigate } from 'react-router-dom';

function CardSkeleton() {
  return (
    <div className="rounded-2xl border p-3">
      <div className="h-56 w-full rounded-xl bg-gray-200 animate-pulse" />
      <div className="mt-3 h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
      <div className="mt-2 h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
      <div className="mt-3 flex gap-2">
        <div className="h-9 w-16 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-9 w-16 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export default function Explore() {
  const [photos, setPhotos] = useState(null); // null = loading, [] allowed
  const { user, role, signInBuyer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      () => setPhotos([]) // on error don't flash "no content"
    );
    return () => unsub();
  }, []);

  const handleView = (id) => {
    navigate(`/photo/${id}`);
  };

  const handleBuy = async (p) => {
    // ensure buyer sign-in
    if (!user) {
      await signInBuyer();
    }
    // server order for photo (use your existing endpoint)
    await loadRazorpay();
    const { orderId, amount, currency, key } = await createServerOrder(
      { type: 'photo', photoId: p.id },
      '/api/razorpay/createPhotoOrder'
    );
    openCheckout({
      key,
      amount,
      currency,
      name: 'Picsellart',
      description: `Purchase: ${p.title}`,
      order_id: orderId,
      prefill: {},
      notes: { photoId: p.id },
      handler: function onSuccess() {
        // After success, redirect to detail where download is unlocked
        navigate(`/photo/${p.id}?p=success`);
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Explore</h1>

      {photos === null && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {Array.isArray(photos) && photos.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((p) => (
            <div key={p.id} className="rounded-2xl border p-3">
              <img
                src={p.watermarkUrl}
                alt={p.title || 'photo'}
                className="h-56 w-full object-cover rounded-xl"
                loading="lazy"
              />
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.title || 'Untitled'}</div>
                  <div className="text-sm text-slate-500">₹{p.price ?? 499}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(p.id)}
                    className="px-4 h-9 rounded-full border text-slate-700 hover:bg-gray-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleBuy(p)}
                    className="px-4 h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(photos) && photos.length === 0 && (
        <div className="mt-10 text-slate-500">No photos yet.</div>
      )}
    </div>
  );
}
