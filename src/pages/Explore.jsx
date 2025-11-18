// src/pages/Explore.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExplorePhotos } from "../utils/storage";

const PAGE_SIZE = 6;

function Explore() {
  const [photos, setPhotos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getExplorePhotos();
        if (!cancelled) {
          setPhotos(data);
          setFiltered(data);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Error loading explore photos", err);
        if (!cancelled) {
          setError("Unable to load images. Please try again in a moment.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter on search
  useEffect(() => {
    const text = searchText.trim().toLowerCase();
    if (!text) {
      setFiltered(photos);
      setCurrentPage(1);
      return;
    }

    const next = photos.filter((p) => {
      return (
        p.fileName.toLowerCase().includes(text) ||
        p.title.toLowerCase().includes(text)
      );
    });

    setFiltered(next);
    setCurrentPage(1);
  }, [searchText, photos]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrev = () =>
    setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const handleNext = () =>
    setCurrentPage((p) => (p < totalPages ? p + 1 : p));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eef1f7 0%, #e2e5ec 60%, #dde0e8 100%)",
      }}
    >
      <main
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "48px 16px 64px",
        }}
      >
        <header style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 800,
              marginBottom: "8px",
              color: "#111827",
            }}
          >
            Explore Marketplace
          </h1>
          <p
            style={{
              color: "#4b5563",
              fontSize: "15px",
              maxWidth: "640px",
            }}
          >
            Curated images from our public gallery and verified sellers.
            Login as a buyer to purchase and download.
          </p>
        </header>

        <div style={{ marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Search images..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "320px",
              padding: "10px 14px",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
            }}
          />
        </div>

        {loading && (
          <p style={{ color: "#4b5563", fontSize: "14px" }}>Loading images…</p>
        )}

        {error && (
          <p style={{ color: "#b91c1c", fontSize: "14px", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: "#4b5563", fontSize: "14px" }}>
            No images found. Try a different search term.
          </p>
        )}

        {/* Grid of cards */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {pageItems.map((photo) => (
            <article
              key={photo.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                padding: "14px",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Image + watermark */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "18px",
                  overflow: "hidden",
                  marginBottom: "12px",
                  backgroundColor: "#111827",
                }}
              >
                <img
                  src={photo.previewUrl}
                  alt={photo.fileName}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    display: "block",
                  }}
                  loading="lazy"
                />
                {/* Watermark overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.0) 0%, rgba(15,23,42,0.38) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 700,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                    mixBlendMode: "overlay",
                  }}
                >
                  Picsellart
                </div>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "2px",
                    color: "#111827",
                  }}
                >
                  {photo.title}
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  {photo.fileName}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  ₹{photo.price}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "auto",
                }}
              >
                {/* View button – goes to view page, still watermarked */}
                <Link
                  to={`/view/${photo.id}`}
                  state={{ photo }}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "8px 0",
                    borderRadius: "999px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#111827",
                    backgroundColor: "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  View
                </Link>

                {/* Buy button – will later enforce buyer login & payment */}
                <Link
                  to="/buyer-login"
                  state={{ fromPhoto: photo }}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "8px 0",
                    borderRadius: "999px",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#f9fafb",
                    background:
                      "linear-gradient(135deg, #050816 0%, #020617 40%, #020617 100%)",
                    textDecoration: "none",
                  }}
                >
                  Buy &amp; Download
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              marginTop: "32px",
            }}
          >
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                backgroundColor: currentPage === 1 ? "#f9fafb" : "#ffffff",
                color: "#111827",
                fontSize: "13px",
                cursor: currentPage === 1 ? "default" : "pointer",
              }}
            >
              Prev
            </button>
            <span
              style={{ fontSize: "13px", color: "#4b5563", minWidth: "80px", textAlign: "center" }}
            >
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                backgroundColor:
                  currentPage === totalPages ? "#f9fafb" : "#ffffff",
                color: "#111827",
                fontSize: "13px",
                cursor: currentPage === totalPages ? "default" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Explore;
