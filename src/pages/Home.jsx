// src/pages/Home.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const LOCAL_HOME_IMAGES = ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg"];

export default function Home() {
  const navigate = useNavigate();

  const images = useMemo(() => {
    // random 3 each visit
    const shuffled = [...LOCAL_HOME_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-kicker">Sell once • Earn many times</div>
        <h1>Turn your photos into income.</h1>
        <p className="hero-sub">
          Architects, designers, bloggers, marketing agencies and businesses buy licensed images from Picsellart.
          You upload once — we handle secure checkout and instant downloads.
        </p>

        <ul className="hero-bullets">
          <li>Set your own price within your selected seller plan.</li>
          <li>Picsellart watermark on previews — clean, full-resolution file after purchase.</li>
          <li>Track views, sales and earnings from your dashboard.</li>
        </ul>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate("/buyer-login")}>
            Buyer Login
          </button>
          <button className="btn" onClick={() => navigate("/seller-login")}>
            Become a Seller
          </button>
          <button className="btn" onClick={() => navigate("/explore")}>
            Explore Pictures
          </button>
        </div>
      </section>

      {/* ✅ Keep images, remove ONLY the yellow heading + description */}
      <section className="home-gallery">
        <div className="home-grid">
          {images.map((src) => (
            <div key={src} className="home-card">
              <img src={src} alt="Marketplace preview" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
