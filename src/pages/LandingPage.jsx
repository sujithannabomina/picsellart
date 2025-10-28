// src/pages/LandingPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PUBLIC_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const picks = useMemo(() => {
    // rotate 3 images, different trio each refresh
    const start = Math.floor(Math.random() * PUBLIC_IMAGES.length);
    return Array.from({ length: 3 }, (_, i) => PUBLIC_IMAGES[(start + i) % PUBLIC_IMAGES.length]);
  }, []); // change on each page load

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % picks.length);
    }, 2800);
    return () => clearInterval(id);
  }, [picks.length]);

  return (
    <div className="container">
      {/* top action bar with 3 buttons exactly as requested */}
      <div className="topActions">
        <button className="btn outline" onClick={() => navigate("/buyer")}>Buyer Login</button>
        <button className="btn outline" onClick={() => navigate("/seller")}>Seller Login</button>
        <button className="btn primary" onClick={() => navigate("/explore")}>Explore</button>
      </div>

      <h1 className="heroTitle">Turn your Images into Income</h1>

      <p className="heroSub">
        Upload your Photos, designs, or creative content and start selling to designers, architects and
        creators today. <span className="dot">|</span> <b>Secure Payments</b> <span className="dot">|</span>{" "}
        <b>Verified Sellers</b> <span className="dot">|</span> <b>Instant Downloads</b> <span className="dot">|</span>
      </p>

      <div className="ctaRow">
        <Link to="/seller" className="btn primary">Start Selling</Link>
        <Link to="/explore" className="btn ghost">Explore Photos</Link>
      </div>

      <div className="thumbRow">
        {picks.map((src, i) => (
          <div key={src} className={`thumb ${current === i ? "on" : ""}`}>
            <img src={src} alt={`preview-${i}`} loading="eager" />
          </div>
        ))}
      </div>
    </div>
  );
}
