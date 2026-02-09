import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import loadRazorpay from "../utils/loadRazorpay";
import { recordPurchase } from "../utils/purchases";

// Decode repeatedly because your URL has %252F (double-encoded)
function decodeRepeated(v, times = 3) {
  let out = v || "";
  for (let i = 0; i < times; i++) {
    try {
      const dec = decodeURIComponent(out);
      if (dec === out) break;
      out = dec;
    } catch {
      break;
    }
  }
  return out;
}

// IMPORTANT: if price is missing in URL, we must still allow checkout.
// Using your current common amount shown in UI: ₹149
const FALLBACK_PRICE_INR = 149;

function buildPhotoFromQuery(sp) {
  const type = sp.get("type") || "";
  const rawId = sp.get("id") || "";
  const rawName = sp.get("name") || sp.get("title") || "Photo";

  // price sometimes missing in your URL -> fallback
  const priceParam = sp.get("price");
  const price = Number(priceParam);
  const finalPrice = Number.isFinite(price) && price > 0 ? price : FALLBACK_PRICE_INR;

  if (!type || !rawId) return null;

  const decodedId = decodeRepeated(rawId, 5);

  // Normalize to something containing "public/images/<file>"
  // Your id formats seen:
  // - sample-public%252Fimages%252Fsample1.jpg  (=> sample-public/images/sample1.jpg)
  // - public/images/sample1.jpg
  const normalized = decodedId.includes("public/images/")
    ? decodedId.slice(decodedId.indexOf("public/images/"))
    : decodedId.replace(/^sample-/, ""); // removes "sample-" prefix if present

  let fileName = "";
  let storagePath = "";
  let photoId = "";
  let previewPath = "";

  if (type === "sample") {
    fileName = normalized.split("/").pop() || "";
    if (!fileName) return null;

    previewPath = `public/images/${fileName}`;

    // ORIGINAL (paid) file location from your Firebase Storage screenshot:
    // Buyer/ folder contains originals
    storagePath = `Buyer/${fileName}`;

    photoId = `sample_${fileName}`;
  } else if (type === "seller") {
    // expects id to be storage path like sellers/<uid>/<file>
    const sellerPath = decodedId.startsWith("sellers/") ? decodedId : "";
    if (!sellerPath) return null;

    storagePath = sellerPath;
    fileName = storagePath.split("/").pop() || "";
    photoId = `seller_${storagePath.replace(/\//g, "_")}`;
  } else {
    return null;
  }

  return {
    id: photoId,
    type,
    name: rawName,
    displayName: rawName,
    price: finalPrice,
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

  // Require buyer login
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

      // Create Razorpay order (server)
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
        handler: async function (response) {
          try {
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

            await recordPurchase(
              user.uid,
              photo,
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
              },
              verifyData.downloadUrl
            );

            nav(
              "/buyer-dashboard?tab=purchases&msg=" +
                encodeURIComponent("Payment successful. Download is ready."),
              { replace: true }
            );
          } catch (e) {
            setErr(e?.message || "Payment verification failed");
          } finally {
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });

      rz.open();
    } catch (e) {
      setErr(e?.message || "Order creation failed");
      setBusy(false);
    }
  };

  // If parsing fails, show your same page (no UI style changes)
  if (!photo) {
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
            <div className="mt-2 text-3xl font-semibold tracking-tight">₹{Number(photo.price || 0)}</div>
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
