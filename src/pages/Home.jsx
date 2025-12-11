// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const LOCAL_HOME_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function getRandomThreeImages() {
  const pool = [...LOCAL_HOME_IMAGES];
  // Simple shuffle
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}

export default function Home() {
  const navigate = useNavigate();
  const [randomImages, setRandomImages] = useState([]);

  useEffect(() => {
    setRandomImages(getRandomThreeImages());
  }, []);

  const handleBuyerLogin = () => navigate("/buyer-login");
  const handleSellerLogin = () => navigate("/seller-login");
  const handleExplore = () => navigate("/explore");

  const heroStyle = useMemo(
    () => ({
      padding: "3rem 1.5rem 2rem",
      maxWidth: "1100px",
      margin: "0 auto",
    }),
    []
  );

  const headingStyle = {
    fontSize: "2.4rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
  };

  const subHeadingStyle = {
    fontSize: "1rem",
    maxWidth: "680px",
    lineHeight: 1.6,
    marginBottom: "1rem",
  };

  const bulletListStyle = {
    marginLeft: "1.2rem",
    marginBottom: "1.5rem",
  };

  const bulletItemStyle = {
    marginBottom: "0.35rem",
  };

  const ctaRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginBottom: "2.5rem",
  };

  const primaryButtonStyle = {
    padding: "0.55rem 1.4rem",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 600,
    background:
      "linear-gradient(90deg, rgba(112,63,247,1) 0%, rgba(236,72,153,1) 100%)",
    color: "#fff",
  };

  const secondaryButtonStyle = {
    ...primaryButtonStyle,
    background: "transparent",
    border: "1px solid rgba(148, 163, 184, 0.8)",
    color: "#111827",
  };

  const samplesSectionStyle = {
    maxWidth: "1100px",
    margin: "0 auto 3rem",
    padding: "0 1.5rem 3rem",
  };

  const samplesGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.25rem",
    marginTop: "1.25rem",
  };

  const sampleCardStyle = {
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(15,23,42,0.10)",
    background: "#fff",
  };

  const sampleImgWrapper = {
    position: "relative",
    width: "100%",
    paddingTop: "66%", // 3:2 aspect ratio
    overflow: "hidden",
  };

  const sampleImgStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const sampleWatermarkStyle = {
    position: "absolute",
    bottom: "8px",
    right: "10px",
    padding: "2px 6px",
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    background: "rgba(15,23,42,0.7)",
    color: "#fff",
    borderRadius: "999px",
  };

  const sampleMetaStyle = {
    padding: "0.75rem 0.9rem 0.9rem",
  };

  return (
    <main>
      {/* HERO */}
      <section style={heroStyle}>
        <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.4rem" }}>
          Sell once • Earn many times
        </p>
        <h1 style={headingStyle}>Turn your photos into income.</h1>
        <p style={subHeadingStyle}>
          Architects, designers, bloggers, marketing agencies and businesses buy
          licensed images from Picsellart. You upload once — we handle secure
          checkout and instant downloads.
        </p>

        <ul style={bulletListStyle}>
          <li style={bulletItemStyle}>
            Set your own price within your selected seller plan.
          </li>
          <li style={bulletItemStyle}>
            Picsellart watermark on previews — clean, full-resolution file after
            purchase.
          </li>
          <li style={bulletItemStyle}>
            Track views, sales and earnings from your dashboard.
          </li>
        </ul>

        <div style={ctaRowStyle}>
          <button style={primaryButtonStyle} onClick={handleBuyerLogin}>
            Buyer Login
          </button>
          <button style={secondaryButtonStyle} onClick={handleSellerLogin}>
            Become a Seller
          </button>
          <button style={secondaryButtonStyle} onClick={handleExplore}>
            Explore Pictures
          </button>
        </div>
      </section>

      {/* SAMPLE IMAGES FROM LOCAL PUBLIC FOLDER */}
      <section style={samplesSectionStyle}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "0.3rem" }}>
          Sample marketplace images
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          These previews come from your local <code>/public/images</code> folder.
          A different set of three will appear on each visit.
        </p>

        <div style={samplesGridStyle}>
          {randomImages.map((src) => (
            <div key={src} style={sampleCardStyle}>
              <div style={sampleImgWrapper}>
                <img src={src} alt="Picsellart sample" style={sampleImgStyle} />
                <div style={sampleWatermarkStyle}>Picsellart</div>
              </div>
              <div style={sampleMetaStyle}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  Street Photography
                </p>
                <p
                  style={{
                    margin: "0.15rem 0 0",
                    fontSize: "0.8rem",
                    color: "#6b7280",
                  }}
                >
                  Example preview from the marketplace
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}