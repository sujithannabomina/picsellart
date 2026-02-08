// FILE PATH: src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import loadRazorpay from "../utils/loadRazorpay";
import { recordPurchase } from "../utils/purchases";

/**
 * ✅ Production checkout flow (Buyer):
 * 1) Read item from URL query: ?type=sample|seller&id=<...>&price=<...>&name=<...>&storagePath=<...>
 * 2) If not logged in → redirect to BuyerLogin with next=/checkout?... (keeps the same URL)
 * 3) Create Razorpay order via serverless API: POST /api/razorpay/create-order
 * 4) Open Razorpay checkout (QR/UPI/card/netbanking)
 * 5) Verify signature via serverless API: POST /api/razorpay/verify-payment
 * 6) Record purchase in Firestore ("purchases" collection)
 * 7) Redirect to BuyerDashboard purchases tab
 *
 * UI classes preserved:
 * - psa-container / psa-card / psa-btn-primary / psa-btn-soft / psa-link
 */

function safeNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function isNonEmptyString(s) {
  return typeof s === "string" && s.trim().length > 0;
}

function sanitizeType(t) {
  if (t === "sample" || t === "seller") return t;
  return "sample";
}

export default function Checkout() {
  const { user, booting } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // ✅ Parse item from querystring
  const item = useMemo(() => {
    const sp = new URLSearchParams(location.search);

    const type = sanitizeType(sp.get("type") || "sample");
    const id = sp.get("id") || "";
    const name = sp.get("name") || sp.get("title") || "Photo";
    const price = safeNum(sp.get("price"), 0);

    // This is the storage path to the ORIGINAL clean image (recommended).
    // Example sample: public/images/sample12.jpg
    // Example seller: sellers/<uid>/<filename>
    const storagePath = sp.get("storagePath") || "";

    // Optional: keep filename for record
    const fileName = sp.get("fileName") || "";

    return {
      type,
      id,
      name,
      price,
      storagePath,
      fileName,
    };
  }, [location.search]);

  const isValidItem = useMemo(() => {
    // Minimal required:
    // - id exists
    // - price > 0
    // - storagePath exists (recommended for clean download)
    // If you currently don’t pass storagePath yet, you can relax this,
    // but then you must supply downloadUrl from somewhere else.
    return isNonEmptyString(item.id) && item.price > 0;
  }, [item]);

  // ✅ Guard: must be logged in (Buyer)
  useEffect(() => {
    if (booting) return;
    if (!user?.uid) {
      // preserve checkout URL and return after login
      const next = `/checkout${location.search || ""}`;
      nav(`/buyer-login?next=${encodeURIComponent(next)}`, { replace: true });
    }
  }, [booting, user, nav, location.search]);

  // If item invalid, show your stable "Checkout unavailable" UI
  if (!isValidItem) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
              <p className="mt-2 text-slate-600">Complete your purchase to download the full file.</p>
            </div>
            <Link className="psa-btn-soft rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400" to="/explore">
              Back to Explore
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 p-6">
            <div className="text-base font-semibold">Checkout unavailable</div>
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

  const payNow = async () => {
    setErr("");
    setBusy(true);

    try {
      if (!user?.uid) {
        const next = `/checkout${location.search || ""}`;
        nav(`/buyer-login?next=${encodeURIComponent(next)}`, { replace: true });
        return;
      }

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Payment system failed to load. Please refresh and try again.");

      // ✅ Create order on server
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountINR: item.price,
          buyerUid: user.uid,
          type: item.type,
          photoId: item.id,
          storagePath: item.storagePath || "",
          fileName: item.fileName || "",
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) throw new Error(data?.error || "Unable to start payment. Please try again.");

      const { orderId, keyId } = data;
      if (!orderId) throw new Error("Order creation failed. Please try again.");
      if (!keyId) throw new Error("Payment key missing on server. Check Vercel env vars.");

      // ✅ Open Razorpay checkout
      const rz = new window.Razorpay({
        key: keyId,
        order_id: orderId,
        amount: Math.round(item.price * 100),
        currency: "INR",
        name: "PicSellArt",
        description: "Photo Purchase",
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        notes: {
          purpose: "photo_purchase",
          type: item.type,
          photoId: item.id,
        },
        theme: { color: "#2563eb" }, // matches your primary
        handler: async function (resp) {
          // resp: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          try {
            // ✅ Verify payment signature on server
            const vr = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                buyerUid: user.uid,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_signature: resp.razorpay_signature,
              }),
            });

            let vdata = {};
            try {
              vdata = await vr.json();
            } catch {
              vdata = {};
            }

            if (!vr.ok || !vdata?.verified) {
              throw new Error(vdata?.error || "Payment verification failed.");
            }

            // ✅ Record purchase (Firestore)
            await recordPurchase(
              user.uid,
              {
                id: item.id,
                fileName: item.fileName || "",
                name: item.name,
                price: item.price,
                storagePath: item.storagePath || "",
                // NOTE: downloadUrl should be generated from storagePath.
                // If you already have a clean downloadUrl generation function, use it.
                // For now, we record storagePath and keep downloadUrl empty.
                downloadUrl: "",
              },
              {
                orderId: resp.razorpay_order_id,
                paymentId: resp.razorpay_payment_id,
                signature: resp.razorpay_signature,
              }
            );

            // ✅ Go to buyer dashboard purchases tab
            nav("/buyer-dashboard?tab=purchases&msg=Payment%20successful.%20Your%20download%20will%20appear%20here.", {
              replace: true,
            });
          } catch (e) {
            alert(e?.message || "Payment completed but we couldn't confirm it. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            // User closed payment popup
            setBusy(false);
          },
        },
      });

      rz.open();
    } catch (e) {
      setErr(e?.message || "Payment failed.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
            <p className="mt-2 text-slate-600">Complete your purchase to download the full file.</p>
          </div>
          <Link className="psa-btn-soft rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400" to="/explore">
            Back to Explore
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="text-sm text-slate-600">Amount</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">₹{item.price}</div>
            <div className="mt-2 text-sm text-slate-600">
              After payment, your download will appear in Buyer Dashboard → Purchases.
            </div>
          </div>

          {err ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={payNow}
              disabled={busy || booting}
              className="psa-btn-primary rounded-2xl px-6 py-3 text-sm disabled:opacity-60"
            >
              {busy ? "Processing..." : "Pay & Complete Purchase"}
            </button>

            <Link
              className="psa-btn-soft rounded-2xl border border-slate-200 px-6 py-3 text-sm hover:border-slate-400"
              to="/explore"
            >
              Continue browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
