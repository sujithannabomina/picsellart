import { useEffect, useState } from "react";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([null, null, null]);

  useEffect(() => {
    let cancelled = false;
    async function loadPreviews() {
      try {
        // Load sample1.jpg, sample2.jpg, sample3.jpg from: public/images/
        const paths = [
          "public/images/sample1.jpg",
          "public/images/sample2.jpg",
          "public/images/sample3.jpg",
        ];
        const urls = [];
        for (const p of paths) {
          try {
            const url = await getDownloadURL(ref(storage, p));
            urls.push(url);
          } catch {
            urls.push(null); // if any is missing, just skip it gracefully
          }
        }
        if (!cancelled) setPreviews(urls);
      } catch {
        if (!cancelled) setPreviews([null, null, null]);
      }
    }
    loadPreviews();
    return () => {
      cancelled = true;
    };
  }, []);

  const btn = {
    padding: "10px 14px",
    border: "1px solid #bbb",
    borderRadius: 6,
    background: "#f4f4f4",
    cursor: "pointer",
    fontWeight: 600,
  };

  const imgStyle = {
    width: 210,
    height: 140,
    objectFit: "cover",
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 960, padding: "40px 16px" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 8 }}>
          Welcome to Picsellart
        </h1>
        <p style={{ color: "#555", marginBottom: 18 }}>
          Your platform for buying and selling creative photos.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 18 }}>
          <button style={btn} onClick={() => navigate("/seller-login")}>Seller Login</button>
          <button style={btn} onClick={() => navigate("/buyer-login")}>Buyer Login</button>
          <button style={btn} onClick={() => navigate("/explore")}>Explore Pictures</button>
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {previews.map((url, i) =>
            url ? (
              <img key={i} src={url} alt={`Preview ${i + 1}`} style={imgStyle} />
            ) : (
              <div
                key={i}
                style={{
                  ...imgStyle,
                  display: "grid",
                  placeItems: "center",
                  background: "#f2f2f2",
                  color: "#999",
                  fontSize: 12,
                }}
              >
                Loading…
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}