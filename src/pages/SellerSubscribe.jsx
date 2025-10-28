// src/pages/SellerSubscribe.jsx
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, serverTs } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { loadRazorpay, createServerOrder, openCheckout } from '../utils/razorpay';
import { useNavigate } from 'react-router-dom';

const PRICE_INR = 49900; // paise (₹499)
const PLAN_CODE = 'basic-180';

export default function SellerSubscribe() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/seller', { replace: true });
      return;
    }
  }, [user]);

  const startPayment = async () => {
    await loadRazorpay();
    const { orderId, amount, currency, key } = await createServerOrder({
      type: 'seller-plan',
      plan: PLAN_CODE,
    });
    openCheckout({
      key,
      amount,
      currency,
      name: 'Picsellart',
      description: 'Seller plan (180 days)',
      order_id: orderId,
      prefill: { name: user.displayName, email: user.email },
      notes: { plan: PLAN_CODE, uid: user.uid },
      handler: async function onSuccess() {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 180);
        await setDoc(doc(db, 'sellers', user.uid), {
          activePlan: true,
          plan: PLAN_CODE,
          startedAt: serverTs(),
          expiresAt,
        }, { merge: true });
        navigate('/seller/dashboard', { replace: true });
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Start Selling</h1>
      <p className="mt-2 text-slate-600">
        Activate your seller plan to unlock uploads, sales tracking, and payouts.
      </p>
      <div className="mt-6 rounded-2xl border p-5">
        <div className="font-semibold">Plan: Basic (180 days)</div>
        <div className="text-slate-700 mt-1">₹499 (one time)</div>
        <button
          onClick={startPayment}
          className="mt-4 px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Pay ₹499 & Activate
        </button>
      </div>
    </div>
  );
}
