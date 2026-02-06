// FILE PATH: src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { recordPurchase } from "../utils/purchases";
import { storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";

function safeDecode(value, times = 2) {
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

  const decodedId = useMemo(() => safeDecode(rawId, 3), [rawId]);

  const storagePath = useMemo(() => {
    if (!decodedId) return "";
    const v = decodedId.startsWith("sample-") ? decodedId.replace("sample-", "") : decodedId;
    const vv = safeDecode(v, 3);

    if (vv.endsWith(".jpg") || vv.endsWith(".jpeg") || vv.endsWith(".png") || vv.endsWith(".webp")) {
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

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!storagePath) {
        setErr("Invalid checkout link. Please go back and try again.");
        setLoading(false);
        return;
      }
      setErr("");
      setLoading(true);
      try {
        // This is for preview file availability.
        // If this fails, your Firebase Storage bucket/env or rules/path is wrong.
        const url = await getDownloadURL(ref(storage, storagePath));
        if (alive) setDownloadUrl(url);
      } catch (e) {
        if (alive) setErr("Unable to load this item right now.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [storagePath]);

  const priceINR = useMemo(() => {
    if (type === "sample") return 149;
    return 149;
  }, [type]);

  const onPay = async () => {
    setErr("");
    setPaying(true);

    try {
      if (!user?.uid) throw new Error("Please login again.");
      if (!storagePath) throw new Error("Invalid item.");
      if (!downloadUrl) throw new Error("Item is not ready.");

      // Load Razorpay SDK
      const ok = await new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
      });
      if (!ok) throw new Error("Payment SDK failed to load. Please disable adblock and retry.");

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY || "";
      if (!key) throw new Error("Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID in Vercel env vars.");

      // ✅ Create Razorpay Order on server (production-safe)
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: priceINR * 100,
          currency: "INR",
          receipt: `buyer_${user.uid}_${Date.now()}`,
          notes: {
            buyerUid: user.uid,
            storagePath,
            type
          }
        })
      });

      const orderData = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok) throw new Error(orderData?.error || "Failed to create order");

      const { orderId } = orderData;
      if (!orderId) throw new Error("Order ID missing from server.");

      // ✅ Open Razorpay with order_id
      const paymentInfo = await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key,
          order_id: orderId,
          amount: priceINR * 100,
          currency: "INR",
          name: "PicSellArt",
          description: "Photo Purchase",
          handler: (response) => resolve(response),
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) }
        });
        rzp.open();
      });

      // ✅ Verify signature on server
      const verifyRes = await fetch("/api/razorpay/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentInfo)
      });

      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) throw new Error(verifyData?.error || "Payment verification failed");

      // ✅ Record purchase (Firestore rules now allow this)
      await recordPurchase(
        user.uid,
        {
          id: decodedId || storagePath,
          fileName: storagePath.split("/").pop() || "photo",
          name: "Photo",
          price: priceINR,
          url: downloadUrl,
          originalUrl: downloadUrl
        },
        paymentInfo
      );

      nav("/buyer-dashboard?tab=purchases&msg=Purchase%20successful.%20Your%20download%20is%20ready.", {
        replace: true
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
        {loading ? (
          <div className="h-[220px] w-full rounded-2xl bg-slate-100 animate-pulse" />
        ) : err ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-medium">Checkout unavailable</div>
            <div className="mt-1">{err}</div>
            <div className="mt-3">
              <Link className="psa-btn-primary" to="/explore">
                Go to Explore
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-600">Amount</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight">₹{priceINR}</div>
              <div className="mt-2 text-sm text-slate-600">
                After payment, your download will appear in <span className="font-medium">Buyer Dashboard → Purchases</span>.
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
          </>
        )}
      </div>
    </div>
  );
}
