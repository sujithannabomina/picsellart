// src/pages/LandingPage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const HERO_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

const LandingPage = () => {
  const navigate = useNavigate();

  // Pick 4 random images on each first render
  const images = useMemo(() => {
    const shuffled = [...HERO_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);

  return (
    <div className="page-wrapper landing-wrapper">
      <div className="page-inner landing-hero">
        {/* LEFT: MAIN TEXT */}
        <div className="hero-text">
          <p className="hero-pill">Sell once • Earn many times</p>
          <h1 className="hero-title">Turn your photos into income.</h1>

          <p className="hero-subtitle">
            Architects, designers, bloggers, marketing agencies and businesses
            buy licensed images from Picsellart. You upload once — we handle
            secure checkout and instant downloads.
          </p>

          <ul className="hero-list">
            <li>Set your own price within your selected seller plan.</li>
            <li>
              Picsellart watermark on previews — clean, full-resolution file
              after purchase.
            </li>
            <li>Track views, sales and earnings from your dashboard.</li>
          </ul>

          <div className="hero-actions">
            <button
              className="pill-button secondary"
              onClick={() => navigate("/buyer/login")}
            >
              Buyer Login
            </button>
            <button
              className="pill-button primary"
              onClick={() => navigate("/seller/login")}
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
        </div>

        {/* RIGHT: 2x2 IMAGE GRID */}
        <div className="hero-images">
          {images.map((src, idx) => (
            <div key={idx} className="hero-card">
              <img src={src} alt={`Picsellart sample ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
