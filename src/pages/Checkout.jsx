// FILE PATH: src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import loadRazorpay from "../utils/loadRazorpay";
import { useAuth } from "../hooks/useAuth";
import { getFixedPriceForImage, normalizeStoragePath } from "../utils/pricing";

function safeNumber(n, fallback = 0) {
  // IMPORTANT: null/undefined/"" must NOT become 0
  if (n === null || n === undefined || n === "") return fallback;
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

export default function Checkout() {
  const { user, booting } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const id = params.get("id") || "";
  const name = params.get("name") || "Photo";

  // Require login
  useEffect(() => {
    if (booting) return;
    if (!user?.uid) {
      nav(`/buyer-login?next=${encodeURIComponent(location.pathname + location.search)}`, { replace: true });
    }
  }, [booting, user, nav, location.pathname, location.search]);

  const photo = useMemo(() => {
    const raw = decodeURIComponent(id || "");
    const storagePath = normalizeStoragePath(raw);
    const fileName = (storagePath || raw).split("/").pop() || "";

    // If price missing/invalid, use deterministic fixed pricing by filename
    const qpPrice = safeNumber(params.get("price"), NaN);
    const fixed = Number.isFinite(qpPrice) && qpPrice > 0 ? qpPrice : getFixedPriceForImage(fileName);

    return {
      id: storagePath || raw || "unknown",
      fileName,
      displayName: name,
      price: fixed,
      storagePath: storagePath || "",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, name]);

  const amountINR = safeNumber(photo.price, 149);

  const startPayment = async () => {
    setErr("");
    setBusy(true);

    try {
      if (!user?.uid) throw new Error("Please login first.");

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Razorpay SDK failed to load.");

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Missing VITE_RAZORPAY_KEY_ID in Vercel env.");

      // 1) Create order on server
      const r1 = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerUid: user.uid,
          amountINR,
          photo,
        }),
      });

      const d1 = await r1.json().catch(() => ({}));
      if (!r1.ok) throw new Error(d1?.error || "Order creation failed");

      const { orderId, amount, currency } = d1;
      if (!orderId) throw new Error("Order creation failed");

      // 2) Open Razorpay checkout
      const rz = new window.Razorpay({
        key,
        amount,
        currency,
        name: "PicSellArt",
        description: "Photo Purchase",
        order_id: orderId,
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        notes: {
          purpose: "buyer_purchase",
          buyerUid: user.uid,
          photoId: photo.id,
          storagePath: photo.storagePath || "",
        },
        theme: { color: "#2563eb" },
        handler: async function (response) {
          try {
            // 3) Verify signature on server (production requirement)
            const r2 = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                buyerUid: user.uid,
                buyerEmail: user.email || "",
                photo,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const d2 = await r2.json().catch(() => ({}));
            if (!r2.ok) throw new Error(d2?.error || "Payment verification failed");

            nav(
              "/buyer-dashboard?tab=purchases&msg=" +
                encodeURIComponent("Payment successful. Your purchase is ready."),
              { replace: true }
            );
          } catch (e) {
            setErr(e?.message || "Payment verification failed");
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      });

      rz.open();
    } catch (e) {
      setErr(e?.message || "Order creation failed");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
            <p className="mt-2 text-slate-600">Complete your purchase to download the full file.</p>
          </div>
          <button
            className="psa-btn-soft rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400"
            onClick={() => nav("/explore")}
            type="button"
          >
            Back to Explore
          </button>
        </div>

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600">Amount</div>
            <div className="mt-2 text-3xl font-semibold">₹{amountINR}</div>
            <div className="mt-2 text-sm text-slate-600">
              After payment, your download will appear in Buyer Dashboard → Purchases.
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={startPayment}
              disabled={busy || booting}
              className="psa-btn-primary rounded-2xl px-6 py-3 text-sm disabled:opacity-60"
              type="button"
            >
              {busy ? "Processing..." : "Pay & Complete Purchase"}
            </button>

            <button
              onClick={() => nav("/explore")}
              className="psa-btn-soft rounded-2xl border border-slate-200 px-6 py-3 text-sm hover:border-slate-400"
              type="button"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
