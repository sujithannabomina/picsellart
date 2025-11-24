// src/pages/Home.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

// A small pool of hero images (from your existing public/images or Firebase URLs)
// You can change the paths/alt text later if you want.
const HERO_IMAGES = [
  { src: "/images/sample1.jpg", alt: "Mountain sunrise landscape" },
  { src: "/images/sample2.jpg", alt: "Forest path in soft light" },
  { src: "/images/sample3.jpg", alt: "Indian street market" },
  { src: "/images/sample4.jpg", alt: "Cityscape evening lights" },
];

function pickRandomImages(list, count = 3) {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function Home() {
  const navigate = useNavigate();

  // Pick a random set of 3 images on each first load / refresh
  const heroImages = useMemo(() => pickRandomImages(HERO_IMAGES, 3), []);

  return (
    <div className="page-wrapper landing-wrapper">
      <div className="landing-hero">
        {/* LEFT: text */}
        <section className="hero-text">
          <p className="hero-pill">Turn your photos into income</p>

          <h1 className="hero-title">Picsellart</h1>

          <p className="hero-subtitle">
            Architects, designers, models and artists upload here and earn.
            Blogs, web designers, marketing agencies and businesses buy licensed
            images from Picsellart.
          </p>

          <ul className="hero-list">
            <li>Set your own price within your chosen plan limits.</li>
            <li>Picsellart watermark on previews — clean file after purchase.</li>
            <li>Track views, sales and earnings from your dashboard.</li>
          </ul>

          <div className="hero-actions">
            <button
              className="pill-button primary"
              onClick={() => navigate("/buyer-login")}
            >
              Buyer Login
            </button>

            <button
              className="pill-button secondary"
              onClick={() => navigate("/seller-login")}
            >
              Become a Seller
            </button>

            <button
              className="pill-button secondary"
              onClick={() => navigate("/explore")}
            >
              Explore Pictures
            </button>
          </div>
        </section>

        {/* RIGHT: rotating images */}
        <section className="hero-images">
          {heroImages.map((img, idx) => (
            <div key={idx} className="hero-card">
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
