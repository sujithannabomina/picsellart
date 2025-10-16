// src/pages/PhotoDetails.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { openRazorpay } from "../utils/loadRazorpay";

function usePhotoPayload() {
  const { state } = useLocation();
  const query = new URLSearchParams(window.location.search);

  // Prefer router state, fallback to query params
  const payload = state || {
    title: query.get("title") || "Street Photography",
    price: Number(query.get("price") || 0),
    photoPath: query.get("path") || "",     // e.g. "public/sample23.jpg" or "Buyer/uid/abc.jpg"
    sellerId: query.get("sellerId") || null,
    isSample: query.get("isSample") === "1",
    url: query.get("url") || "",            // public URL if already resolved
  };
  return payload;
}

export default function PhotoDetails() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const p = usePhotoPayload();

  const displayPrice = useMemo(() => {
    if (Number.isFinite(p.price)) return `₹${p.price}`;
    return "₹—";
  }, [p.price]);

  const startCheckout = async () => {
    if (!p.photoPath || !Number.isFinite(p.price)) {
      alert("Missing photo info.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/createPhotoOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: p.title || "Street Photography",
          price: p.price,
          photoPath: p.photoPath,
          sellerId: p.sellerId || null, // null means platform sale (sample photos)
          isSample: !!p.isSample,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Order creation failed");

      await openRazorpay({
        order: data.order,
        metadata: {
          title: p.title,
          photoPath: p.photoPath,
          sellerId: p.sellerId,
          isSample: !!p.isSample,
        },
        onSuccess: () => {
          nav("/buyer/dashboard");
        },
        onFailure: () => setBusy(false),
      });
    } catch (e) {
      console.error(e);
      alert(e.message || "Could not start checkout.");
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <button className="text-sm text-indigo-600 hover:underline" onClick={() => nav(-1)}>
        ← Back
      </button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border">
          {/* We keep it simple: if a URL was provided we show it; otherwise we rely on the explore card to pass a resolved URL. */}
          {p.url ? (
            <img src={p.url} alt={p.title} className="w-full h-auto object-cover" />
          ) : (
            <div className="p-10 text-center text-slate-500">Preview will appear when opened from Explore.</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{p.title || "Street Photography"}</h1>
          <p className="mt-2 text-slate-600">
            Royalty-free, single-seat license. Instant download after successful payment.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="text-2xl font-bold">{displayPrice}</div>
            <button
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
              onClick={startCheckout}
              disabled={busy}
            >
              {busy ? "Processing..." : "Buy & Download"}
            </button>
          </div>

          {p.isSample ? (
            <p className="mt-3 text-xs text-slate-500">
              Sold by Picsellart. This image comes from our curated catalog.
            </p>
          ) : (
            <p className="mt-3 text-xs text-slate-500">
              Sold by the original creator on Picsellart. We settle payouts weekly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
