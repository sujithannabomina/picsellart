// src/pages/Home.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // keep showing 3 images, but NO "Sample marketplace images" title or paragraph
  const sampleImages = useMemo(() => {
    // pick 3 stable samples
    return ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg"];
  }, []);

  return (
    <div className="page page-home">
      <section className="hero">
        <div className="hero-text">
          <div className="hero-kicker">Sell once • Earn many times</div>
          <h1 className="hero-heading">Turn your photos into income.</h1>
          <p className="hero-subtitle">
            Architects, designers, bloggers, marketing agencies and businesses buy licensed
            images from Picsellart. You upload once — we handle secure checkout and instant downloads.
          </p>
          <ul className="hero-list">
            <li>Set your own price within your selected seller plan.</li>
            <li>Picsellart watermark on previews — clean, full-resolution file after purchase.</li>
            <li>Track views, sales and earnings from your dashboard.</li>
          </ul>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/buyer-login")}>
              Buyer Login
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/seller-login")}>
              Become a Seller
            </button>
            <button className="btn btn-ghost" onClick={() => navigate("/explore")}>
              Explore Pictures
            </button>
          </div>
        </div>

        <div className="hero-gallery">
          {sampleImages.map((src, idx) => (
            <div className="hero-image-card" key={idx}>
              <img src={src} alt="Preview" loading="lazy" />
            </div>
          ))}
          {/* one more slot for balance */}
          <div className="hero-image-card">
            <img src="/images/sample4.jpg" alt="Preview" loading="lazy" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
