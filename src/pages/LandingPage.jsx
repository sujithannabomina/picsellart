import React, { useMemo } from "react";
import { Link } from "react-router-dom";

/**
 * LandingPage.jsx
 * - Clean hero like your older mock
 * - Rotating 3-image filmstrip from /public/images
 * - Primary CTA routes sellers to plan/payment
 * - Secondary CTA routes to explore grid
 *
 * Keep the headline/subcopy EXACT as requested.
 */

const ALL_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function pickThree(arr) {
  // Deterministic-ish shuffle per refresh, then take 3
  const seed = Date.now() % 97;
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (i + seed) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 3);
}

export default function LandingPage() {
  // Pick three on each mount/refresh
  const picks = useMemo(() => pickThree(ALL_IMAGES), []);

  return (
    <main className="main-safe-top">
      <section className="section-pad">
        <div className="hero-wrap">
          {/* HERO */}
          <header aria-label="Intro">
            <h1 className="hero-title">Turn your Images into Income</h1>

            <p className="hero-sub">
              Upload your Photos, designs, or creative content and start selling to
              designers, architects and creators today. | Secure Payments | Verified
              Sellers | Instant Downloads |
            </p>

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/seller/plan" className="btn btn-primary">
                Start Selling
              </Link>
              <Link to="/explore" className="btn btn-ghost">
                Explore Photos
              </Link>
            </div>

            {/* Tiny trust line (kept compact) */}
            <div className="hero-badges">Secure • Fast Payouts • Simple Setup</div>
          </header>

          {/* FILMSTRIP (3 images) */}
          <div className="filmstrip">
            {picks.map((src, i) => (
              <figure key={src + i} className="film-img">
                <img src={src} alt="Popular photo on picsellart" loading="eager" />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
