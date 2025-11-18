// src/pages/ViewImage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

function ViewImage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const statePhoto = location.state?.photo || null;

  const [photo, setPhoto] = useState(statePhoto);
  const [loading, setLoading] = useState(!statePhoto);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        // Storage path is stored as encoded in the URL
        const storagePath = statePhoto?.storagePath || decodeURIComponent(id);
        const imgRef = ref(storage, storagePath);
        const url = await getDownloadURL(imgRef);

        if (!cancelled) {
          setPhoto((prev) => ({
            ...(prev || {}),
            storagePath,
            previewUrl: url,
            fileName: prev?.fileName || storagePath.split("/").pop(),
            title: prev?.title || "Street Photography",
            price: prev?.price || 399,
          }));
        }
      } catch (err) {
        console.error("Error loading image for view page", err);
        if (!cancelled) {
          setError("Unable to load this image. It may have been moved or removed.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!statePhoto) {
      load();
    } else {
      // Already have URL and meta from Explore (but still ensure previewUrl exists)
      if (!statePhoto.previewUrl) {
        load();
      } else {
        setLoading(false);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [id, statePhoto]);

  const handleBack = () => {
    if (location.state?.from === "explore") {
      navigate(-1);
    } else {
      navigate("/explore");
    }
  };

  const handleBuy = () => {
    // Later: check buyer login + Razorpay payment + serve clean original.
    navigate("/buyer-login", { state: { fromPhoto: photo } });
  };

  const watermarkTextStyle = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: 800,
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.40)",
    mixBlendMode: "overlay",
    textAlign: "center",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eef1f7 0%, #e2e5ec 60%, #dde0e8 100%)",
      }}
    >
      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "48px 16px 64px",
        }}
      >
        <button
          onClick={handleBack}
          style={{
            marginBottom: "24px",
            padding: "6px 14px",
            borderRadius: "999px",
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            fontSize: "13px",
            color: "#111827",
            cursor: "pointer",
          }}
        >
          ← Back to Explore
        </button>

        {loading && (
          <p style={{ color: "#4b5563", fontSize: "14px" }}>Loading image…</p>
        )}

        {error && (
          <p style={{ color: "#b91c1c", fontSize: "14px" }}>{error}</p>
        )}

        {!loading && !error && photo && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
              gap: "32px",
              alignItems: "flex-start",
            }}
          >
            {/* Image area */}
            <div
              style={{
                borderRadius: "28px",
                backgroundColor: "#020617",
                padding: "16px",
                boxShadow: "0 22px 50px rgba(15, 23, 42, 0.55)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: "22px",
                  overflow: "hidden",
                  backgroundColor: "#020617",
                  maxHeight: "70vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={photo.previewUrl}
                  alt={photo.fileName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
                {/* Strong watermark – ALWAYS on until purchase logic is added */}
                <div style={watermarkTextStyle}>PICSELLART</div>
              </div>
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "11px",
                  color: "#9ca3af",
                  textAlign: "center",
                }}
              >
                Watermarked preview shown. Purchase to download the full
                resolution, clean image.
              </p>
            </div>

            {/* Details + actions */}
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "8px",
                  color: "#111827",
                }}
              >
                {photo.title}
              </h1>
              <p
                style={{
                  fontSize: "13px",
                  color: "#4b5563",
                  marginBottom: "4px",
                }}
              >
                {photo.fileName}
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: "16px",
                }}
              >
                ₹{photo.price}
              </p>

              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <button
                  onClick={handleBuy}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: "999px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #ec4899 100%)",
                    color: "#f9fafb",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Buy &amp; Download
                </button>
                <button
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Continue browsing
                </button>
              </div>

              <div
                style={{
                  marginTop: "8px",
                  padding: "12px 16px",
                  borderRadius: "16px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                  color: "#4b5563",
                }}
              >
                <strong style={{ display: "block", marginBottom: "4px" }}>
                  Licensing & usage
                </strong>
                <span>
                  Purchased files include a standard commercial license. You can
                  use them in client work, social media, print and web designs.
                  Reselling raw files or sharing the download link is not
                  allowed.
                </span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ViewImage;
