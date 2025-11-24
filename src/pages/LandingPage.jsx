import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <section className="landing-hero">
        {/* LEFT: TEXT */}
        <div className="hero-text">
          <p className="hero-pill">
            Verified Sellers • Instant Downloads • Secure Payments
          </p>

          <h1 className="hero-title">
            Discover Stunning Visuals From Talented Creators
          </h1>

          <p className="hero-subtitle">
            Browse premium, high-quality images uploaded by photographers and
            creators across India. Buy and download instantly with full
            commercial rights.
          </p>

          <ul className="hero-list">
            <li>
              Perfect for designers, agencies, interior projects and campaigns.
            </li>
            <li>
              Picsellart watermark on previews – clean file delivered after
              secure payment.
            </li>
            <li>Support independent creators with every purchase.</li>
          </ul>

          <div className="hero-actions">
            <a href="/explore" className="pill-button primary">
              Explore Images
            </a>
            <a href="/seller-login" className="pill-button secondary">
              Sell Your Photos
            </a>
          </div>
        </div>

        {/* RIGHT: IMAGE GRID */}
        <div className="hero-images">
          <div className="hero-card">
            <img
              src="/images/sample1.jpg"
              alt="Sunset sky street photo"
              loading="lazy"
            />
          </div>
          <div className="hero-card">
            <img
              src="/images/sample3.jpg"
              alt="South Indian tiffin cafe"
              loading="lazy"
            />
          </div>
          <div className="hero-card">
            <img
              src="/images/sample4.jpg"
              alt="Cultural festival performance"
              loading="lazy"
            />
          </div>
          <div className="hero-card">
            <img
              src="/images/sample23.jpg"
              alt="Indian food closeup"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
