// src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const q = useQuery();
  const navigate = useNavigate();
  const auth = getAuth();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const type = q.get("type") || "sample";
  const id = q.get("id") || "";
  const amount = Number(q.get("amount") || 169);

  // FRONTEND env (must exist in Vercel)
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // MUST exist in Vercel (call Firebase Functions directly)
  // Example:
  // VITE_CREATE_ORDER_URL = https://createorder-o67lgxsola-el.a.run.app
  // VITE_VERIFY_PAYMENT_URL = https://asia-south1-picsellart-619a7.cloudfunctions.net/verifyPayment
  const createOrderUrl = import.meta.env.VITE_CREATE_ORDER_URL;
  const verifyUrl = import.meta.env.VITE_VERIFY_PAYMENT_URL;

  useEffect(() => {
    setErr("");
  }, [type, id, amount]);

  async function handlePay() {
    try {
      setErr("");
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        setErr("Please login to continue.");
        setLoading(false);
        return;
      }
      if (!razorpayKey) {
        setErr("Missing Razorpay Key ID (VITE_RAZORPAY_KEY_ID).");
        setLoading(false);
        return;
      }
      if (!createOrderUrl) {
        setErr("Missing VITE_CREATE_ORDER_URL in Vercel env.");
        setLoading(false);
        return;
      }
      if (!verifyUrl) {
        setErr("Missing VITE_VERIFY_PAYMENT_URL in Vercel env.");
        setLoading(false);
        return;
      }

      const ok = await loadRazorpayScript();
      if (!ok) {
        setErr("Failed to load Razorpay.");
        setLoading(false);
        return;
      }

      // 1) Create Order (Firebase Function URL)
      const createRes = await fetch(createOrderUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          itemId: id,
          buyerUid: user.uid,
          type,
        }),
      });

      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok || !createData.orderId) {
        throw new Error(createData?.error || "create-order failed");
      }

      // 2) Open Razorpay
      const rzp = new window.Razorpay({
        key: razorpayKey,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "PicSellArt",
        description: "Purchase",
        order_id: createData.orderId,

        handler: async function (response) {
          try {
            // 3) Verify Payment (Firebase Function URL)
            const vr = await fetch(verifyUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                itemId: id,
                buyerUid: user.uid,
                amount,
              }),
            });

            const vd = await vr.json().catch(() => ({}));
            if (!vr.ok || !vd.ok) {
              throw new Error(vd?.error || "verify-payment failed");
            }

            navigate("/buyer-dashboard?tab=purchases");
          } catch (e) {
            console.error(e);
            setErr(e?.message || "Payment succeeded but verification failed.");
          } finally {
            setLoading(false);
          }
        },

        prefill: { email: user.email || "" },
        theme: { color: "#2563eb" },
        modal: { ondismiss: () => setLoading(false) },
      });

      rzp.open();
    } catch (e) {
      console.error(e);
      setErr(e?.message || "Payment failed");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Checkout</h1>
          <p className="mt-2 text-slate-600">Complete your purchase to download the full file.</p>
        </div>

        <button
          onClick={() => navigate("/explore")}
          className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-slate-100"
        >
          Back to Explore
        </button>
      </div>

      {err ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {err}
        </div>
      ) : null}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-xl border border-slate-100 p-6">
          <div className="text-sm font-semibold text-slate-500">Amount</div>
          <div className="mt-2 text-5xl font-extrabold text-slate-900">₹{amount}</div>
          <p className="mt-3 text-slate-600">
            After payment, your download will appear in Buyer Dashboard → Purchases.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              onClick={handlePay}
              disabled={loading}
              className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Pay & Complete Purchase"}
            </button>

            <button
              onClick={() => navigate("/explore")}
              className="rounded-full border border-slate-200 bg-slate-50 px-6 py-3 font-semibold text-blue-700 hover:bg-slate-100"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-slate-500">© 2026 PicSellArt</div>
    </div>
  );
}
