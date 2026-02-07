// FILE PATH: src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { recordPurchase } from "../utils/purchases";
import { storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";

function safeDecode(value, times = 3) {
  let v = value || "";
  for (let i = 0; i < times; i++) {
    try {
      const decoded = decodeURIComponent(v);
      if (decoded === v) break;
      v = decoded;
    } catch {
      break;
    }
  }
  return v;
}

export default function Checkout() {
  const { user, booting } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const sp = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const type = sp.get("type") || "sample";
  const rawId = sp.get("id") || "";

  const decodedId = useMemo(() => safeDecode(rawId, 5), [rawId]);

  // /checkout?type=sample&id=sample-<encodedStoragePathOrFilename>
  const storagePath = useMemo(() => {
    if (!decodedId) return "";
    const v = decodedId.startsWith("sample-") ? decodedId.replace("sample-", "") : decodedId;
    const vv = safeDecode(v, 5);

    if (
      vv.endsWith(".jpg") ||
      vv.endsWith(".jpeg") ||
      vv.endsWith(".png") ||
      vv.endsWith(".webp")
    ) {
      return `public/images/${vv}`;
    }

    return vv;
  }, [decodedId]);

  const currentCheckoutUrl = useMemo(() => `/checkout${location.search}`, [location.search]);

  useEffect(() => {
    if (booting) return;
    if (!user?.uid) {
      nav("/buyer-login", { replace: true, state: { next: currentCheckoutUrl } });
    }
  }, [booting, user, nav, currentCheckoutUrl]);

  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState("");

  // IMPORTANT CHANGE:
  // ✅ Do NOT block checkout because downloadURL failed.
  // We fetch download URL only AFTER successful payment (best effort).
  const priceINR = useMemo(() => {
    if (type === "sample") return 149;
    return 149;
  }, [type]);

  const loadRazorpaySdk = async () => {
    const ok = await new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
    return ok;
  };

  const onPay = async () => {
    setErr("");
    setPaying(true);

    try {
      if (!user?.uid) throw new Error("Please login again.");
      if (!storagePath) throw new Error("Invalid checkout link. Please go back and try again.");

      const ok = await loadRazorpaySdk();
      if (!ok) throw new Error("Payment SDK failed to load. Please disable adblock and retry.");

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY || "";
      if (!key) throw new Error("Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID in env vars.");

      // ✅ Create order on server (production-safe)
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountINR: priceINR,
          notes: {
            purpose: "buyer_purchase",
            buyerUid: user.uid,
            photoId: decodedId || "",
            storagePath,
            type,
          },
        }),
      });

      let orderData = {};
      try {
        orderData = await orderRes.json();
      } catch {
        orderData = {};
      }

      if (!orderRes.ok) {
        throw new Error(orderData?.error || "Unable to start payment. Check server keys.");
      }

      const { orderId, amount, currency } = orderData;

      const paymentInfo = await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key,
          amount,
          currency,
          order_id: orderId,
          name: "PicSellArt",
          description: "Photo Purchase",
          handler: (response) => resolve(response),
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        });
        rzp.open();
      });

      // ✅ Try to get download URL after payment (best effort)
      let downloadUrl = "";
      try {
        downloadUrl = await getDownloadURL(ref(storage, storagePath));
      } catch {
        downloadUrl = "";
      }

      // ✅ Record purchase (NOW allowed by rules once you deploy)
      await recordPurchase(user.uid, {
        id: decodedId || storagePath,
        fileName: storagePath.split("/").pop() || "photo",
        name: "Photo",
        price: priceINR,
        storagePath,
        downloadUrl, // may be empty; dashboard can fetch later
      }, paymentInfo);

      nav("/buyer-dashboard?tab=purchases&msg=Purchase%20successful.%20Your%20download%20is%20ready.", {
        replace: true,
      });
    } catch (e) {
      setErr(e?.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (booting) {
    return (
      <div className="psa-container">
        <div className="psa-card p-6">
          <div className="h-6 w-48 rounded-xl bg-slate-100 animate-pulse" />
          <div className="mt-4 h-24 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="psa-container">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="psa-title">Checkout</h1>
          <p className="psa-subtitle mt-1">Complete your purchase to download the full file.</p>
        </div>
        <Link className="psa-btn-soft" to="/explore">
          Back to Explore
        </Link>
      </div>

      <div className="psa-card p-4 sm:p-6">
        {err ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-medium">Payment not completed</div>
            <div className="mt-1">{err}</div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">Amount</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">₹{priceINR}</div>
          <div className="mt-2 text-sm text-slate-600">
            After payment, your download will appear in{" "}
            <span className="font-medium">Buyer Dashboard → Purchases</span>.
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button className="psa-btn-primary" onClick={onPay} disabled={paying}>
            {paying ? "Processing..." : "Pay & Complete Purchase"}
          </button>

          <Link className="psa-btn-soft" to="/explore">
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
