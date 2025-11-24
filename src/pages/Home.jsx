// src/pages/Home.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Pick 3 random sample images on each mount / refresh
  const heroImages = useMemo(() => {
    const TOTAL_SAMPLES = 112; // change if you add more sample images
    const indices = new Set();

    while (indices.size < 3 && indices.size < TOTAL_SAMPLES) {
      const randomIndex = Math.floor(Math.random() * TOTAL_SAMPLES) + 1; // 1..112
      indices.add(randomIndex);
    }

    return Array.from(indices).map((i) => ({
      src: `/images/sample${i}.jpg`,
      alt: `Picsellart sample ${i}`,
    }));
  }, []);

  return (
    <section className="landing-hero">
      {/* LEFT: TEXT CONTENT */}
      <div className="hero-text">
        <div className="hero-pill">Sell photos • Buy visuals • India-first</div>

        {/* MAIN TAGLINE */}
        <h1 className="hero-title">Turn your photos into income</h1>

        <p className="hero-subtitle">
          Picsellart is a simple marketplace where creators upload real-world
          photos from India and earn on every download. Designers, agencies and
          businesses buy licensed images in a few clicks.
        </p>

        <ul className="hero-list">
          <li>Upload your best street, travel, interior and food photos.</li>
          <li>Set your own price within the plan limits and get paid per sale.</li>
          <li>Buyers receive instant, watermark-free files after secure checkout.</li>
        </ul>

        <div className="hero-actions">
          <button
            type="button"
            className="pill-button primary"
            onClick={() => navigate("/buyer-login")}
          >
            Buyer Login
          </button>

          <button
            type="button"
            className="pill-button secondary"
            onClick={() => navigate("/seller-login")}
          >
            Seller Login
          </button>

          <button
            type="button"
            className="pill-button secondary"
            onClick={() => navigate("/explore")}
          >
            Explore Pictures
          </button>
        </div>
      </div>

      {/* RIGHT: IMAGE STRIP – uses random images each visit */}
      <div className="hero-images">
        {heroImages.map((img, idx) => (
          <div className="hero-card" key={idx}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
