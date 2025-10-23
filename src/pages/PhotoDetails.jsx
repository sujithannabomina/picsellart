// src/pages/PhotoDetails.jsx
// Receives photo payload via router state or fetch; uses Razorpay to purchase.
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openRazorpay, toCustomer } from "../utils/loadRazorpay";
import { useAuth } from "../context/AuthContext";

function usePhotoPayload() {
  const { state } = useLocation();
  // Expect at least { id, title, previewUrl, price } via router state.
  // If not present, you can later fetch by route param.
  return state || {};
}

export default function PhotoDetails() {
  const { user } = useAuth?.() || { user: null };
  const nav = useNavigate();
  const photo = usePhotoPayload();
  const [busy, setBusy] = useState(false);
  const customer = toCustomer(user);

  const displayPrice = useMemo(() => {
    const n = Number(photo?.price ?? 0);
    return Number.isFinite(n) ? n.toFixed(2) : "0.00";
  }, [photo?.price]);

  async function buy() {
    if (!user) return nav("/buyer/login");
    if (!photo?.id) return alert("Missing photo information.");
    setBusy(true);
    try {
      await openRazorpay({
        mode: "photo",
        userId: user.uid || user.id,
        amount: photo.price,                 // in rupees (server will convert to paise if needed)
        customer,
        meta: { photoId: photo.id, title: photo.title || "" },
      });
      nav("/buyer/dashboard");
    } catch (e) {
      console.error(e);
      alert("Could not start payment. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section container">
      <div className="grid">
        <div className="card" style={{ gridColumn: "span 7" }}>
          {photo?.previewUrl ? (
            <img src={photo.previewUrl} alt={photo.title || "Preview"} />
          ) : (
            <div style={{ padding: 24 }} className="muted">No preview available.</div>
          )}
        </div>

        <div className="card" style={{ gridColumn: "span 5", padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>{photo.title || "Untitled photo"}</h2>
          <p className="muted">{photo.description || "High-resolution licensed image."}</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 16 }}>
            <strong style={{ fontSize: 24 }}>₹{displayPrice}</strong>
            <span className="muted">one-time</span>
          </div>
          <button className="btn" style={{ marginTop: 16, width: "100%" }} onClick={buy} disabled={busy}>
            {busy ? "Starting checkout…" : "Buy & download"}
          </button>
          <p className="muted" style={{ marginTop: 10 }}>
            Watermarked preview is shown above. Original will be available in your dashboard after successful payment.
          </p>
        </div>
      </div>
    </main>
  );
}
