import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { openRazorpay } from "../utils/loadRazorpay";

const PLANS = [
  { id: "starter", label: "Starter", rupees: 100, uploads: 25, maxPrice: 199, days: 180 },
  { id: "pro", label: "Pro", rupees: 300, uploads: 30, maxPrice: 249, days: 180 },
  { id: "elite", label: "Elite", rupees: 800, uploads: 50, maxPrice: 249, days: 180 },
];

export default function SellerGateway() {
  const { user, loginSeller } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      if (!user) await loginSeller();
      if (!user?.uid) return;

      const cur = await getDoc(doc(db, "plans", user.uid));
      if (cur.exists() && cur.data().active) {
        nav("/seller-dashboard");
      }
    })();
  }, [user]);

  async function buy(p) {
    await openRazorpay({
      amount: p.rupees * 100,
      description: `Picsellart Seller Plan • ${p.label}`,
      notes: { plan: p.id },
      onSuccess: async (rzp) => {
        await setDoc(
          doc(db, "plans", user.uid),
          {
            active: true,
            planId: p.id,
            uploads: p.uploads,
            maxPrice: p.maxPrice,
            rupees: p.rupees,
            purchasedAt: serverTimestamp(),
            paymentId: rzp.razorpay_payment_id,
          },
          { merge: true }
        );
        nav("/seller-dashboard");
      },
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold">Choose a Seller Plan</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow">
            <div className="font-bold text-lg">{p.label}</div>
            <div className="text-slate-600 text-sm mt-1">
              {p.uploads} uploads • ₹{p.maxPrice} max/asset • {p.days} days
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xl font-semibold">₹{p.rupees}</span>
              <button className="px-4 py-2 rounded-full bg-indigo-600 text-white" onClick={() => buy(p)}>
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
