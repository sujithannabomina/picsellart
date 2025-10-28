// src/pages/PhotoDetails.jsx
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { loadRazorpay, createServerOrder, openCheckout } from '../utils/razorpay';
import { useAuth } from '../context/AuthContext';

export default function PhotoDetails() {
  const { id } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { user, signInBuyer } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const snap = await getDoc(doc(db, 'photos', id));
      setPhoto(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    }
    run();
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10">Loading…</div>;
  if (!photo) return <div className="max-w-4xl mx-auto px-4 py-10">Not found</div>;

  const handleBuy = async () => {
    if (!user) await signInBuyer();
    await loadRazorpay();
    const { orderId, amount, currency, key } = await createServerOrder(
      { type: 'photo', photoId: photo.id },
      '/api/razorpay/createPhotoOrder'
    );
    openCheckout({
      key,
      amount,
      currency,
      name: 'Picsellart',
      description: `Purchase: ${photo.title}`,
      order_id: orderId,
      prefill: {},
      notes: { photoId: photo.id },
      handler: function onSuccess() {
        navigate(`/photo/${photo.id}?p=success`);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <img
        src={photo.watermarkUrl}
        alt={photo.title}
        className="w-full rounded-2xl object-cover"
      />
      <h1 className="mt-6 text-3xl font-bold">{photo.title || 'Untitled'}</h1>
      {Array.isArray(photo.tags) && photo.tags.length > 0 && (
        <div className="mt-2 text-slate-600">#{photo.tags.join(' #')}</div>
      )}
      <div className="mt-4 flex items-center gap-3">
        <div className="text-xl font-semibold">₹{photo.price ?? 499}</div>
        <button
          onClick={handleBuy}
          className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Buy & Download
        </button>
      </div>
      {search.get('p') === 'success' && (
        <div className="mt-6 rounded-lg bg-green-50 text-green-700 p-3">
          Payment successful! Your download is available in your Buyer dashboard.
        </div>
      )}
    </div>
  );
}
