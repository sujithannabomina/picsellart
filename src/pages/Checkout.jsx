import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import loadRazorpay from "../utils/loadRazorpay";
import { recordPurchase } from "../utils/purchases";

// Helper: build a "photo" object from query params
function buildPhotoFromQuery(sp) {
  const type = sp.get("type") || "";
  const id = sp.get("id") || "";
  const price = Number(sp.get("price") || 0);
  const name = sp.get("name") || "Photo";

  if (!type || !id || !Number.isFinite(price) || price <= 0) return null;

  // Your existing urls look like:
  // /checkout?type=sample&id=sample-public%2Fimages%2Fsample1.jpg
  // We'll convert to:
  // preview path (public/images/...) and original path (Buyer/...)
  let fileName = "";
  let previewPath = "";
  let storagePath = "";
  let photoId = "";

  if (type === "sample") {
    // id may contain encoded "public/images/sampleX.jpg"
    const decoded = decodeURIComponent(id);
    // decoded example: "sample-public/images/sample1.jpg" or "public/images/sample1.jpg"
    const normalized = decoded.includes("public/images/")
      ? decoded.slice(decoded.indexOf("public/images/"))
      : decoded;

    fileName = normalized.split("/").pop() || "";
    previewPath = `public/images/${fileName}`;
    storagePath = `Buyer/${fileName}`; // ORIGINALS stored here (private)
    photoId = `sample_${fileName}`;
  } else if (type === "seller") {
    // For seller items your Explore/View must pass storagePath already OR encode it in id
    const decoded = decodeURIComponent(id);
    // expected: "sellers/<sellerUid>/<file>"
    storagePath = decoded.startsWith("sellers/") ? decoded : "";
    fileName = storagePath.split("/").pop() || "";
    previewPath = ""; // you already show watermarked preview in UI elsewhere
    photoId = `seller_${storagePath.replace(/\//g, "_")}`;
  } else {
    return null;
  }

  return {
    id: photoId,
    type,
    name,
    displayName: name,
    price,
    fileName,
    previewPath,
    storagePath,
  };
}

export default function Checkout() {
  const { user, booting } = useAuth();
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const photo = useMemo(() => buildPhotoFromQuery(sp), [sp]);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Guard: require buyer login
  useEffect(() => {
    if (booting) return;
    if (!user?.uid) {
      const next = `/checkout?${sp.toString()}`;
      nav(`/buyer-login?next=${encodeURIComponent(next)}`, { replace: true });
    }
  }, [booting, user, nav, sp]);

  const payNow = async () => {
    setErr("");
    setBusy(true);

    try {
      if (!user?.uid) throw new Error("Please login first.");
      if (!photo) throw new Error("Checkout unavailable. Unable to load this item right now.");

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Razorpay SDK failed to load.");

      // 1) Create order on server
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerUid: user.uid,
          amountINR: Number(photo.price || 0),
          photoId: photo.id,
          title: photo.displayName || "PicSellArt Photo",
        }),
      });

      const orderData = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok) throw new Error(orderData?.error || "Order creation failed");

      const { orderId, amount, currency, keyId } = orderData;
      if (!orderId || !keyId) throw new Error("Order creation failed");

      // 2) Open Razorpay Checkout (REAL payments supported by your live key)
      const rz = new window.Razorpay({
        key: keyId,
        amount,
        currency: currency || "INR",
        name: "PicSellArt",
        description: photo.displayName || "Photo purchase",
        order_id: orderId,
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: { color: "#000000" },
        handler: async function (response) {
          try {
            // 3) Verify payment on server + get signed download url
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                buyerUid: user.uid,
                photo,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok) throw new Error(verifyData?.error || "Payment verification failed");

            // 4) Record purchase in Firestore (client side) for Buyer Dashboard
            await recordPurchase(
              user.uid,
              photo,
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
              },
              verifyData.downloadUrl
            );

            // 5) Go to buyer dashboard purchases tab
            nav("/buyer-dashboard?tab=purchases&msg=" + encodeURIComponent("Payment successful. Download is ready."), {
              replace: true,
            });
          } catch (e) {
            setErr(e?.message || "Payment verification failed");
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
          },
        },
      });

      rz.open();
    } catch (e) {
      setErr(e?.message || "Order creation failed");
      setBusy(false);
    }
  };

  // UI: keep your style (same layout class style)
  if (!photo) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
              <p className="mt-2 text-slate-600">Complete your purchase to download the full file.</p>
            </div>
            <Link to="/explore" className="psa-btn-soft rounded-2xl border border-slate-200 px-5 py-3 text-sm hover:border-slate-400">
              Back to Explore
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 p-6">
            <div className="font-medium">Checkout unavailable</div>
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

  const amountText = `₹${Number(photo.price || 0)}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
            <p className="mt-2 text-slate-600">Complete your purchase to download the full file.</p>
          </div>
          <Link
            to="/explore"
            className="psa-btn-soft rounded-2xl border border-slate-200 px-5 py-3 text-sm hover:border-slate-400"
          >
            Back to Explore
          </Link>
        </div>

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-slate-200 p-6">
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600">Amount</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{amountText}</div>
            <div className="mt-2 text-sm text-slate-600">
              After payment, your download will appear in Buyer Dashboard → Purchases.
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={payNow}
              disabled={busy || booting}
              className="psa-btn-primary rounded-2xl px-6 py-3 text-sm disabled:opacity-60"
            >
              {busy ? "Processing..." : "Pay & Complete Purchase"}
            </button>

            <Link
              to="/explore"
              className="psa-btn-soft rounded-2xl border border-slate-200 px-6 py-3 text-sm hover:border-slate-400"
            >
              Continue browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
