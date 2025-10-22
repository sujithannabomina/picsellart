// src/pages/PhotoDetails.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrderClient, launchRazorpay } from "../utils/loadRazorpay";

/**
 * This page expects to receive a `photo` payload via router state:
 *   navigate("/photo/:id", { state: { photo } })
 * where `photo` includes:
 *   {
 *     id, title, price, ownerId, ownerName?,
 *     watermarkedUrl?, publicUrl?, thumbUrl?,
 *     tags?, isSample? (boolean)  // for Picsellart-owned samples
 *   }
 *
 * Behavior:
 * - Shows watermarked image (if available) before purchase.
 * - "Buy" opens Razorpay; on success, backend verifies & grants access.
 * - If user is not signed in, redirects to Buyer Login.
 */

function usePhotoPayload() {
  const { state } = useLocation();
  // If deep-linked without state, you could fetch by route param here (omitted for simplicity).
  return state?.photo ?? null;
}

function Price({ value }) {
  if (value == null) return <span className="muted">—</span>;
  return <span style={{ fontWeight: 800 }}>₹{value}</span>;
}

export default function PhotoDetails() {
  const photo = usePhotoPayload();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [buying, setBuying] = useState(false);

  const displayUrl = useMemo(() => {
    // Prefer watermarked; fallback to thumb/public
    return photo?.watermarkedUrl || photo?.thumbUrl || photo?.publicUrl || "";
  }, [photo]);

  async function handleBuy() {
    if (!photo) return;
    if (!user) {
      // Force buyer login before purchase
      navigate("/buyer/login", { replace: true });
      return;
    }

    try {
      setBuying(true);
      // Create an order for a photo purchase (not a plan)
      // The backend /api/createOrder should accept purchaseType === "photo"
      const order = await createOrderClient({
        amount: Number(photo.price) * 100, // paisa
        currency: "INR",
        userId: user.uid,
        purchaseType: "photo",
        photoId: photo.id,
        sellerId: photo.ownerId || "picsellart",
        title: photo.title || "Photo",
        isSample: !!photo.isSample
      });

      await launchRazorpay({
        order,
        user,
        onSuccess: () => {
          // After successful verification, buyer should see their purchase
          alert("Payment successful! Your HD download will be available in your dashboard.");
          navigate("/buyer/dashboard");
        }
      });
    } catch (e) {
      console.error("Buy failed:", e);
      alert("Unable to start payment. Please try again.");
    } finally {
      setBuying(false);
    }
  }

  if (!photo) {
    return (
      <main className="section">
        <div className="container card">
          <div className="card-body">
            <h1 className="page-title">Photo not found</h1>
            <p className="page-desc">This photo link appears to be invalid or missing.</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => navigate("/explore")}>Back to Explore</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="card-body" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
            <div>
              {displayUrl ? (
                <img
                  src={displayUrl}
                  alt={photo.title || "Photo"}
                  style={{ width: "100%", height: "auto", borderRadius: 12 }}
                />
              ) : (
                <div className="skeleton" style={{ height: 420 }} />
              )}
            </div>
            <div>
              <h1 className="page-title" style={{ fontSize: 28 }}>{photo.title || "Untitled"}</h1>
              <p className="muted" style={{ marginTop: 6 }}>
                {photo.ownerName ? `By ${photo.ownerName}` : (photo.isSample ? "Picsellart Sample" : "Seller")}
              </p>

              <div style={{ marginTop: 18, fontSize: 18 }}>
                Price: <Price value={photo.price} />
              </div>

              {Array.isArray(photo.tags) && photo.tags.length > 0 ? (
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {photo.tags.map((t) => (
                    <span key={t} className="badge">{t}</span>
                  ))}
                </div>
              ) : null}

              <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                <button
                  className="btn btn--brand"
                  onClick={handleBuy}
                  disabled={buying}
                >
                  {buying ? "Processing…" : "Buy & Download HD"}
                </button>
                <button className="btn" onClick={() => navigate(-1)}>Back</button>
              </div>

              <div className="muted" style={{ marginTop: 14, fontSize: 13 }}>
                • Watermark will be removed after successful purchase.<br />
                • Purchased images appear in your Buyer Dashboard with invoice & license info.
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-body">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>License & Usage</h3>
            <p className="muted">
              This purchase grants a standard license to use the image for personal or commercial
              projects according to our <a href="/policy" className="link">policy</a>. Redistribution
              or resale is not permitted. For extended licenses, contact us via the
              <a href="/contact" className="link"> contact page</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
