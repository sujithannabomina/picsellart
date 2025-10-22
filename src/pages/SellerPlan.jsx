// src/pages/SellerPlan.jsx
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { PLANS } from "../utils/plans";
import { openRazorpay } from "../utils/loadRazorpay";
import { useNavigate } from "react-router-dom";

function addDays(ts, days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return Timestamp.fromDate(d);
}

export default function SellerPlan() {
  const { user, loading, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [userDoc, setUserDoc] = useState(null);

  const planList = useMemo(() => Object.values(PLANS), []);

  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      setUserDoc(snap.exists() ? snap.data() : null);
    })();
  }, [user, loading]);

  async function handlePay(plan) {
    if (!user) {
      await loginWithGoogle();
      return;
    }
    setBusy(true);
    try {
      await openRazorpay({
        mode: "seller",
        amount: plan.price, // rupees
        meta: { planId: plan.id, uid: user.uid },
      });

      // Mark/refresh seller plan (client-side; consider webhook later)
      const ref = doc(db, "users", user.uid);
      await setDoc(
        ref,
        {
          role: "seller",
          email: user.email || "",
          planId: plan.id,
          maxUploads: plan.maxUploads,
          maxPricePerImage: plan.maxPricePerImage,
          uploadsUsed: 0,                 // fresh count for new pack
          expiresAt: addDays(Timestamp.now(), plan.days),
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      navigate("/seller/dashboard");
    } catch (e) {
      console.error(e);
      alert("Payment not completed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section container">
      <div className="text-center mb-8">
        <h1>Choose your Seller Pack</h1>
        <p className="text-slate-600">Simple, creator-friendly pricing. Pay once and start selling.</p>
      </div>

      <div className="grid">
        {planList.map((p) => (
          <article key={p.id} className="rounded-2xl border border-[#e2e8f0] p-6 bg-white">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-medium text-slate-900">{p.label}</h3>
              <div className="text-slate-900 text-xl">₹{p.price}</div>
            </div>
            <ul className="mt-3 text-sm text-slate-600 space-y-1">
              <li>Upload limit: {p.maxUploads} images</li>
              <li>Max price per image: ₹{p.maxPricePerImage}</li>
              {/* Intentionally do NOT mention days per your rule */}
            </ul>
            <button
              className="btn btn-primary mt-4 w-full"
              disabled={busy}
              onClick={() => handlePay(p)}
              aria-label={`Pay for ${p.label}`}
            >
              {busy ? "Processing..." : `Pay ₹${p.price}`}
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
