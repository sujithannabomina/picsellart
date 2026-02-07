src/pages/Checkout.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { recordPurchase } from "../utils/purchases";
import { storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";

// IMPORTANT:
// - Checkout is URL-driven (no location.state required).
// - Uses: /checkout?type=sample&id=<something>
// - Production safety: if Firebase Storage URL fails, fallback to hosted /images/<file>.

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

function isImageFileName(name) {
  const n = (name || "").toLowerCase();
  return n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png") || n.endsWith(".webp");
}

export default function Checkout() {
  const { user, booting } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const sp = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const type = sp.get("type") || "sample";
  const rawId = sp.get("id") || "";

  const decodedId = useMemo(() => safeDecode(rawId, 3), [rawId]);

  // Explore generates:
  // id = sample-<encodeURIComponent("public/images/sampleX.jpg")>
  const storagePath = useMemo(() => {
    if (!decodedId) return "";

    const v = decodedId.startsWith("sample-") ? decodedId.replace("sample-", "") : decodedId;
    const vv = safeDecode(v, 3);

    // If user directly passed filename like sample1.jpg
    if (isImageFileName(vv)) return `public/images/${vv}`;

    // If user passed full storage path already
    return vv;
  }, [decodedId]);

  const fileName = useMemo(() => {
    if (!storagePath) return "";
    const parts = storagePath.split("/");
    return parts[parts.length - 1] || "";
  }, [storagePath]);

  const hostedFallbackUrl = useMemo(() => {
    // Vite public folder serves /images/<file> if your file is in /public/images/<file>
    if (!fileName) return "";
    return `/images/${fileName}`;
  }, [fileName]);

  const currentCheckoutUrl = useMemo(() => `/checkout${location.search}`, [location.search]);

  // If not logged in, redirect to buyer login with safe "next"
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

  // Load URL (Firebase Storage first; if it fails, fallback to hosted file)
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

      // 1) Try Firebase Storage URL
      try {
        const url = await getDownloadURL(ref(storage, storagePath));
        if (alive) {
          setDownloadUrl(url);
          setLoading(false);
        }
        return;
      } catch {
        // ignore -> fallback below
      }

      // 2) Fallback to hosted public file (prevents “Checkout unavailable”)
      if (hostedFallbackUrl) {
        if (alive) {
          setDownloadUrl(hostedFallbackUrl);
          setLoading(false);
        }
        return;
      }

      // 3) If nothing works
      if (alive) {
        setErr("Unable to load this item right now.");
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [storagePath, hostedFallbackUrl]);

  // Stable test price (you can later map by Firestore photo docs)
  const priceINR = useMemo(() => {
    if (type === "sample") return 149;
    return 149;
  }, [type]);

  const onPay = async () => {
    setErr("");
    setPaying(true);

    try {
      if (!user?.uid) throw new Error("Please login again.");
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

      const key =
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        import.meta.env.VITE_RAZORPAY_KEY ||
        "";

      if (!key) throw new Error("Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID in your hosting env vars.");

      // Open payment (client-only test flow)
      const paymentInfo = await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key,
          amount: priceINR * 100,
          currency: "INR",
          name: "PicSellArt",
          description: "Photo Purchase",
          handler: (response) => resolve(response),
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) }
        });
        rzp.open();
      });

      // Record purchase in Firestore
      await recordPurchase(
        user.uid,
        {
          id: decodedId || storagePath,
          fileName: fileName || "photo",
          name: "Photo",
          price: priceINR,
          url: downloadUrl,
          originalUrl: downloadUrl
        },
        paymentInfo
      );

      // Go to Buyer Dashboard purchases
      nav("/buyer-dashboard?tab=purchases&msg=Purchase%20successful.%20Your%20download%20is%20ready.", {
        replace: true
      });
    } catch (e) {
      setErr(e?.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  // Boot/loading shell (prevents white screens)
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
          </>
        )}
      </div>
    </div>
  );
}
