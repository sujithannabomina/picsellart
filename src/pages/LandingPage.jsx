import React, { useMemo } from "react";
import { Link } from "react-router-dom";

/**
 * Landing page:
 * - Keeps your exact headline/subtitle copy
 * - Pill buttons (Buyer Login, Seller Login, Start Selling)
 * - 3 showcase images randomized on each refresh (from /public/images)
 * - No backend details shown; just short trust bullets
 * - Optional tiny feature strip at bottom (can be removed)
 */

const CATALOG = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function pickThree(from) {
  const arr = [...from];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}

export default function LandingPage() {
  const images = useMemo(() => pickThree(CATALOG), []);

  return (
    <main className="psa-landing">
      {/* Hero */}
      <section className="psa-hero">
        <div className="psa-hero-grid">
          {/* Left: copy + CTAs */}
          <div className="psa-hero-copy">
            <h1 className="psa-hero-title">Turn your Images into Income</h1>

            <p className="psa-hero-subtitle">
              Upload your Photos, designs, or creative content and start selling to
              designers, architects and creators today. | Secure Payments | Verified
              Sellers | Instant Downloads |
            </p>

            <div className="psa-cta-row">
              <Link to="/buyer-login" className="btn btn-ghost">
                Buyer Login
              </Link>
              <Link to="/seller-login" className="btn btn-ghost">
                Seller Login
              </Link>
              <Link to="/seller-subscribe" className="btn btn-primary">
                Start Selling
              </Link>
            </div>

            {/* short, user-facing assurances (kept compact) */}
            <ul className="psa-trust">
              <li>Server-verified payments with Razorpay.</li>
              <li>Originals delivered only after successful payment.</li>
              <li>Watermarked previews protect your work.</li>
            </ul>
          </div>

          {/* Right: randomized images */}
          <div className="psa-hero-gallery">
            {images.map((src, i) => (
              <div className="psa-frame" key={src}>
                <img src={src} alt={`Showcase ${i + 1}`} loading="eager" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Optional micro-features. Remove this whole section if you want zero content below hero. */}
      <section className="psa-feature-strip">
        <div>
          <div className="psa-feature">
            <h3>For Buyers</h3>
            <p>Quick checkout with Razorpay. Licenses & downloads saved to your dashboard.</p>
          </div>
          <div className="psa-feature">
            <h3>For Sellers</h3>
            <p>Upload, auto-watermark previews, set prices by plan, track sales & payouts.</p>
          </div>
          <div className="psa-feature">
            <h3>Secure & Smooth</h3>
            <p>Google sign-in, Firebase storage, and verified payments for a safe flow.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
