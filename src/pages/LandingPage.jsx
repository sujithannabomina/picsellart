// src/pages/LandingPage.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HERO_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

const pickThree = () => {
  const shuffled = [...HERO_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const heroImages = useMemo(() => pickThree(), []);

  const isBuyer = user && role === "buyer";
  const isSeller = user && role === "seller";

  const handleBuyerClick = () => {
    if (!isBuyer) navigate("/buyer-login");
    else navigate("/buyer-dashboard");
  };

  const handleSellerClick = () => {
    if (!isSeller) navigate("/seller-login");
    else navigate("/seller-dashboard");
  };

  return (
    <main className="landing-wrapper">
      <section className="landing-hero">
        <div className="hero-images">
          {heroImages.map((src) => (
            <figure key={src} className="hero-card">
              <img src={src} alt="Picsellart preview" />
            </figure>
          ))}
        </div>

        <div className="hero-text">
          <p className="hero-pill">
            Verified Sellers · Instant Downloads · Secure Payments
          </p>
          <h1 className="hero-title">Turn your Images into Income</h1>
          <p className="hero-subtitle">
            Upload your street photography, interiors, designs or creative
            content and start selling to designers, architects and creators.
            Buyers get instant, watermark-free downloads after secure Razorpay
            checkout.
          </p>

          <ul className="hero-list">
            <li>Set your own price within your plan limits.</li>
            <li>Picsellart watermark on previews – clean file after purchase.</li>
            <li>Track views, sales and earnings from your dashboard.</li>
          </ul>

          <div className="hero-actions">
            <button className="pill-button primary" onClick={handleSellerClick}>
              Seller Login
            </button>
            <button
              className="pill-button secondary"
              onClick={handleBuyerClick}
            >
              Buyer Login
            </button>
            <button
              className="pill-button secondary"
              onClick={() => navigate("/explore")}
            >
              Explore Photos
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
