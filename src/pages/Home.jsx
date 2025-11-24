import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const HERO_IMAGES = [
  "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg",
  "https://images.pexels.com/photos/1785493/pexels-photo-1785493.jpeg",
  "https://images.pexels.com/photos/532173/pexels-photo-532173.jpeg",
  "https://images.pexels.com/photos/631165/pexels-photo-631165.jpeg",
];

function shuffleAndPick(list, count) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

export default function Home() {
  const navigate = useNavigate();

  // Pick 3 images in random order each time the page loads
  const images = useMemo(() => shuffleAndPick(HERO_IMAGES, 3), []);

  return (
    <main className="landing-wrapper">
      <section className="landing-hero">
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
              type="button"
              className="pill-button secondary"
              onClick={() => navigate("/buyer-login")}
            >
              Buyer Login
            </button>
            <button
              type="button"
              className="pill-button primary"
              onClick={() => navigate("/seller-login")}
            >
              Become a Seller
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

        <div className="hero-images">
          {images.map((src, index) => (
            <div key={index} className="hero-card">
              <img src={src} alt={`Sample gallery ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
