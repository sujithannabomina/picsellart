// src/pages/Explore.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllExploreImages,
  filterAndPaginate,
} from "../utils/storage";

export default function Explore() {
  const [allImages, setAllImages] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageData, setPageData] = useState({ data: [], isLast: true });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const images = await fetchAllExploreImages();
      setAllImages(images);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const result = filterAndPaginate(allImages, page, search);
    setPageData(result);
  }, [allImages, page, search]);

  const handleView = (img) => {
    navigate(`/view/${img.id}`);
  };

  const handleBuy = (img) => {
    // Buyer must log in before payment
    navigate("/buyer-login");
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Explore Marketplace</h1>
      <p className="page-subtitle">
        Curated images from our public gallery and verified sellers. Login as a
        buyer to purchase and download.
      </p>

      <div className="explore-header-row">
        <input
          className="explore-search-input"
          type="text"
          placeholder="Search images..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {loading ? (
        <p>Loading images…</p>
      ) : pageData.data.length === 0 ? (
        <p>No images found.</p>
      ) : (
        <>
          <div className="explore-grid">
            {pageData.data.map((img) => (
              <div className="explore-card" key={img.id}>
                <img
                  src={img.thumbnailUrl}
                  alt={img.name}
                  className="explore-card-image"
                />
                <div className="explore-card-title">{img.category}</div>
                <div className="explore-card-meta">{img.name}</div>
                <div className="explore-card-price">₹{img.price}</div>
                <div className="explore-card-actions">
                  <button
                    className="explore-btn"
                    onClick={() => handleView(img)}
                  >
                    View
                  </button>
                  <button
                    className="explore-btn primary"
                    onClick={() => handleBuy(img)}
                  >
                    Buy &amp; Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => {
                if (!pageData.isLast) setPage((p) => p + 1);
              }}
              disabled={pageData.isLast}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
