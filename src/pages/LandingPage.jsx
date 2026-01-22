// FILE: src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const HERO = Array.from({ length: 6 }, (_, i) => `/images/sample${i + 1}.jpg`);

export default function Home() {
  const location = useLocation();
  const pick = () => HERO[Math.floor(Math.random() * HERO.length)];
  const [hero, setHero] = useState(pick());

  // Rotate on every refresh AND each time user visits Home again
  useEffect(() => {
    setHero(pick());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const three = useMemo(() => {
    const shuffled = [...HERO].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [hero]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "34px 18px 60px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 22,
          alignItems: "center",
        }}
        className="home-hero-grid"
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid #eee",
              fontSize: 13,
              color: "#444",
              marginBottom: 14,
              background: "#fafafa",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 99, background: "#7c3aed" }} />
            Premium photos • Secure checkout • Instant access
          </div>

          <h1 style={{ fontSize: 44, lineHeight: 1.1, margin: 0, fontWeight: 800, color: "#111" }}>
            Buy & sell stunning images with confidence.
          </h1>

          <p style={{ marginTop: 14, fontSize: 16.5, lineHeight: 1.65, color: "#444", maxWidth: 560 }}>
            PicSellart is a marketplace for photographers and creators. Browse our curated gallery or become a seller
            with a simple subscription plan. We handle secure checkout and keep everything organized in your dashboard.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <Link
              to="/explore"
              style={{
                background: "#7c3aed",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 700,
                boxShadow: "0 10px 25px rgba(124,58,237,0.18)",
              }}
            >
              Explore Pictures
            </Link>

            <Link
              to="/buyer-login"
              style={{
                background: "#fff",
                color: "#111",
                padding: "12px 18px",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 700,
                border: "1px solid #eee",
              }}
            >
              Buyer Login
            </Link>

            <Link
              to="/seller-login"
              style={{
                background: "#fff",
                color: "#111",
                padding: "12px 18px",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 700,
                border: "1px solid #eee",
              }}
            >
              Seller Login
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 22 }}>
            {three.map((src) => (
              <div
                key={src}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #eee",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
                  background: "#fff",
                }}
              >
                <img src={src} alt="sample" style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { t: "Instant browsing", d: "Curated sample gallery + seller uploads." },
              { t: "Secure payments", d: "Razorpay checkout with verification." },
              { t: "Seller dashboards", d: "Plan limits, uploads, earnings tracking." },
            ].map((x) => (
              <div
                key={x.t}
                style={{
                  flex: "1 1 240px",
                  border: "1px solid #eee",
                  borderRadius: 16,
                  padding: 14,
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 800, color: "#111" }}>{x.t}</div>
                <div style={{ color: "#555", marginTop: 6, fontSize: 14.5, lineHeight: 1.55 }}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid #eee",
            boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
            background: "#fff",
            minHeight: 480,
          }}
        >
          <div style={{ padding: 14, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 800, color: "#111" }}>Featured</div>
            <div style={{ color: "#666", fontSize: 13 }}>refresh changes image</div>
          </div>
          <img
            src={hero}
            alt="Hero"
            style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 920px){
          .home-hero-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
