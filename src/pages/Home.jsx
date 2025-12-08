// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HERO_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function getRandomImages(count) {
  const shuffled = [...HERO_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const Home = () => {
  const navigate = useNavigate();

  // pick 4 images once per mount (so they change on refresh/visit)
  const [heroImages] = React.useState(() => getRandomImages(4));

  return (
    <main className="page page-home">
      <section className="hero">
        <div className="hero-text">
          <p className="hero-kicker">Sell once • Earn many times</p>

          <h1 className="hero-heading">Turn your photos into income.</h1>

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

          <div className="hero-buttons">
            <button
              className="btn btn-outline"
              onClick={() => navigate("/buyer-login")}
            >
              Buyer Login
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/seller-login")}
            >
              Become a Seller
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/explore")}
            >
              Explore Pictures
            </button>
          </div>
        </div>

        <div className="hero-gallery" aria-label="Sample images preview">
          {heroImages.map((src, index) => (
            <div key={src} className="hero-image-card">
              <img src={src} alt={`Sample ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
