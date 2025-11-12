import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchAllExploreImages, filterAndPaginate } from "../utils/storage";
import {
  DEFAULT_PAGE_SIZE,
  nextPage,
  prevPage,
  priceToINR,
} from "../utils/exploreData";
import { openRazorpay } from "../utils/loadRazorpay";
import { useAuth } from "../context/AuthContext";
import WatermarkedImage from "../components/WatermarkedImage";

export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allImages, setAllImages] = useState([]);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "ready" | "error"
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Fetch all images on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setError("");

        const images = await fetchAllExploreImages();

        if (!cancelled) {
          setAllImages(images);
          setStatus("ready");
        }
      } catch (err) {
        console.error("Failed to load explore images", err);
        if (!cancelled) {
          setError("Unable to load images right now. Please try again later.");
          setStatus("error");
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Derive current page items
  const { items, totalItems, totalPages, page: safePage } = useMemo(
    () =>
      filterAndPaginate(allImages, {
        searchTerm,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      }),
    [allImages, searchTerm, page]
  );

  // Keep local state in sync with clamped page from filterAndPaginate
  useEffect(() => {
    if (safePage !== page) {
      setPage(safePage);
    }
  }, [safePage, page]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleNextPage = () => {
    setPage((current) => nextPage(current, totalPages));
  };

  const handlePrevPage = () => {
    setPage((current) => prevPage(current, totalPages));
  };

  const handleBuy = async (image) => {
    // Require buyer login
    if (!user) {
      navigate("/buyer-login");
      return;
    }

    try {
      const amountPaise = image.price * 100;

      await openRazorpay({
        amount: amountPaise,
        currency: "INR",
        imageName: image.name,
        buyer: {
          uid: user.uid,
          email: user.email,
        },
      });

      // Note: your existing openRazorpay should handle:
      //  - calling Firebase Functions to create & verify order
      //  - recording purchase in Firestore
      //  - redirect / toast on success
    } catch (err) {
      console.error("Payment failed or cancelled", err);
      // Optional: show toast or message
    }
  };

  const renderBody = () => {
    if (status === "loading") {
      return <p>Loading images…</p>;
    }

    if (status === "error") {
      return <p className="text-danger">{error}</p>;
    }

    if (!items || items.length === 0) {
      return (
        <p className="explore-empty">
          No images found. Try a different search term.
        </p>
      );
    }

    return (
      <>
        <div className="explore-grid">
          {items.map((img) => (
            <article key={img.id} className="card">
              <div className="card-image-wrapper">
                <WatermarkedImage
                  src={img.downloadURL}
                  alt={img.title}
                  className="card-image"
                />
              </div>
              <div className="card-body">
                <h3 className="card-title">{img.title}</h3>
                <div className="card-meta">
                  <span className="text-muted truncate">{img.name}</span>
                  <span className="price-tag">{priceToINR(img.price)}</span>
                </div>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate(`/photo/${encodeURIComponent(img.name)}`)}
                >
                  Preview
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleBuy(img)}
                >
                  Buy &amp; Download
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="explore-toolbar mt-4">
            <span className="text-muted" style={{ fontSize: "0.85rem" }}>
              Showing {items.length} of {totalItems} images
            </span>
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handlePrevPage}
                disabled={safePage <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleNextPage}
                disabled={safePage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Header />
      <main className="page-container">
        <section className="explore-header">
          <h1 className="page-heading">Street Photography</h1>
          <p className="page-subtitle">
            Curated images from our public gallery and verified sellers. Login
            as a buyer to purchase and download.
          </p>

          <div className="explore-toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClearSearch}
              disabled={!searchTerm}
            >
              Clear
            </button>
          </div>
        </section>

        {renderBody()}
      </main>
    </>
  );
}
