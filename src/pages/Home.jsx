// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper landing-wrapper">
      <main className="landing-hero">
        {/* LEFT: TEXT */}
        <section className="hero-text">
          <p className="hero-pill">
            Verified Sellers • Instant Downloads • Secure Payments
          </p>

          <h1 className="hero-title">Turn your images into income</h1>

          <p className="hero-subtitle">
            Upload your street photography, interior shots or creative work and
            sell directly to designers, architects and agencies. Buyers get
            instant, watermark-free downloads after secure Razorpay checkout.
          </p>

          <ul className="hero-list">
            <li>Set your own price within your seller plan limits.</li>
            <li>Picsellart watermark on previews — clean file after purchase.</li>
            <li>Track views, sales and earnings from your dashboard.</li>
          </ul>

          <div className="hero-actions">
            <button
              type="button"
              className="pill-button primary"
              onClick={() => navigate("/seller/login")}
            >
              Seller Login
            </button>
            <button
              type="button"
              className="pill-button secondary"
              onClick={() => navigate("/buyer/login")}
            >
              Buyer Login
            </button>
            <button
              type="button"
              className="pill-button secondary"
              onClick={() => navigate("/explore")}
            >
              Explore Photos
            </button>
          </div>
        </section>

        {/* RIGHT: IMAGE GRID (4 cards) */}
        <section className="hero-images" aria-hidden="true">
          <div className="hero-card">
            <img src="/images/sample3.jpg" alt="South Indian tiffin hotel" />
          </div>
          <div className="hero-card">
            <img src="/images/sample19.jpg" alt="Indian classical dancers" />
          </div>
          <div className="hero-card">
            <img src="/images/sample5.jpg" alt="Temple architecture" />
          </div>
          <div className="hero-card">
            <img src="/images/sample23.jpg" alt="Indian breakfast close-up" />
          </div>
        </section>
      </main>
    </div>
  );
}
