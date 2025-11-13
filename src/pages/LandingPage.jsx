import { Link } from "react-router-dom";
import "./LandingPage.css"; // (styling below inlined after this file)
const picks = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function pickRandom() {
  return picks[Math.floor(Math.random() * picks.length)];
}

export default function LandingPage() {
  const hero = pickRandom();

  return (
    <main className="lp-shell">
      <section className="lp-hero">
        <div className="lp-hero-media">
          <img className="lp-hero-img" src={hero} alt="Featured" loading="eager" />
        </div>

        <div className="lp-content">
          <h1 className="lp-title">Turn your Images into Income</h1>
          <p className="lp-sub">
            Upload your Photos, designs, or creative content and start selling to designers,
            architects and creators today. <span className="lp-bullets">| Secure Payments | Verified Sellers | Instant Downloads |</span>
          </p>

          <div className="lp-cta">
            <Link to="/seller-login" className="ps-btn primary">Seller Login</Link>
            <Link to="/buyer-login" className="ps-btn ghost">Buyer Login</Link>
            <Link to="/explore" className="ps-btn dark">Explore Photos</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
