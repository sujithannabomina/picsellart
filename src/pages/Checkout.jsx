// FILE PATH: src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import loadRazorpay from "../utils/loadRazorpay";

function safeDecode(v) {
  if (!v) return "";
  try {
    // handle double-encoding
    const once = decodeURIComponent(v);
    return decodeURIComponent(once);
  } catch {
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  }
}

// Build photo object from your query params.
// You can extend this later for seller items from Firestore.
function buildPhotoFromQuery(type, id) {
  if (!type || !id) return null;

  // SAMPLE FLOW (your current URLs look like: id=sample-public%2Fimages%2Fsample12.jpg)
  if (type === "sample") {
    const decoded = safeDecode(id);

    // accepted formats:
    // - "public/images/sample12.jpg"
    // - "sample-public/images/sample12.jpg"
    const path = decoded.startsWith("public/")
      ? decoded
      : decoded.includes("public/images/")
        ? decoded.slice(decoded.indexOf("public/images/"))
        : decoded.replace(/^sample-/, "");

    if (!path || !path.startsWith("public/images/")) return null;

    // your UI showed ₹149 in screenshots
    return {
      id: `sample-${path}`,
      storagePath: path,
      fileName: path.split("/").pop(),
      displayName: "Sample Photo",
      price: 149,
      currency: "INR",
    };
  }

  // If you add seller checkout later, handle type === "seller" here
  return null;
}

export default function Checkout() {
  const { user, booting } = useAuth();
  const [sp] = useSearchParams();
  const nav = useNavigate();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const type = sp.get("type") || "";
  const id = sp.get("id") || "";

  const photo = useMemo(() => buildPhotoFromQuery(type, id), [type, id]);

  // Hard guard: must be buyer logged in
  useEffect(() => {
    if (booting) return;
    if (!user?.uid) {
      const next = `/checkout?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
      nav(`/buyer-login?next=${encodeURIComponent(next)}`, { replace: true });
    }
  }, [booting, user, nav, type, id]);

  const payNow = async () => {
    setErr("");
    setBusy(true);

    try {
      if (!user?.uid) throw new Error("Please login as buyer.");
      if (!photo) throw new Error("Unable to load this item right now.");

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Razorpay SDK failed to load.");

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY;
      if (!key) throw new Error("Missing VITE_RAZORPAY_KEY_ID in env vars.");

      // 1) Create order on server
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountINR: Number(photo.price || 0),
          receipt: `buyer_${user.uid}_${Date.now()}`,
          notes: {
            purpose: "buyer_purchase",
            buyerUid: user.uid,
            photoId: photo.id,
            storagePath: photo.storagePath,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Order creation failed");

      // 2) Open Razorpay checkout
      const rz = new window.Razorpay({
        key,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "PicSellArt",
        description: "Photo purchase",
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: { color: "#2563eb" }, // matches your blue buttons
        handler: async function (response) {
          // 3) Verify + write purchase server-side + get signed download URL
          const vr = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              buyerUid: user.uid,
              photo: {
                id: photo.id,
                fileName: photo.fileName,
                displayName: photo.displayName,
                price: photo.price,
                storagePath: photo.storagePath,
              },
              razorpay: response,
            }),
          });

          const vdata = await vr.json().catch(() => ({}));
          if (!vr.ok) throw new Error(vdata?.error || "Payment verification failed");

          // 4) Send buyer to dashboard
          nav("/buyer-dashboard?tab=purchases&msg=Payment%20successful.%20Your%20download%20is%20ready.", {
            replace: true,
          });
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
          },
        },
      });

      rz.open();
    } catch (e) {
      setErr(e?.message || "Payment failed");
      setBusy(false);
    }
  };

  // UI: keep same style you already use
  if (!photo) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
              <p className="mt-2 text-slate-600">Complete your purchase to download the full file.</p>
            </div>
            <Link to="/explore" className="psa-btn-soft rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400">
              Back to Explore
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 p-6">
            <div className="font-semibold">Checkout unavailable</div>
            <div className="mt-1 text-sm text-slate-600">Unable to load this item right now.</div>
            <div className="mt-4">
              <Link className="psa-btn-primary rounded-2xl px-4 py-2 text-sm" to="/explore">
                Go to Explore
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
            <p className="mt-2 text-slate-600">Complete your purchase to download the full file.</p>
          </div>
          <Link to="/explore" className="psa-btn-soft rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400">
            Back to Explore
          </Link>
        </div>

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="text-sm text-slate-600">Amount</div>
            <div className="mt-1 text-2xl font-semibold">₹{Number(photo.price || 0)}</div>
            <div className="mt-3 text-sm text-slate-600">
              After payment, your download will appear in Buyer Dashboard → Purchases.
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button
              className="psa-btn-primary rounded-2xl px-5 py-3 text-sm disabled:opacity-60"
              onClick={payNow}
              disabled={busy || booting}
            >
              {booting ? "Loading..." : busy ? "Processing..." : "Pay & Complete Purchase"}
            </button>

            <Link
              to="/explore"
              className="psa-btn-soft rounded-2xl border border-slate-200 px-5 py-3 text-sm hover:border-slate-400"
            >
              Continue browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
