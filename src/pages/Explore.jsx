// src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getExplorePhotos } from "../utils/storage";
import ImageCard from "../components/ImageCard";
import Pagination from "../components/Pagination";

export default function Explore() {
  const [photos, setPhotos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 8;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await getExplorePhotos();
        if (!cancelled) {
          setPhotos(data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Unable to load images right now. Please try again.");
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter(
      (p) =>
        p.filename.toLowerCase().includes(q) ||
        (p.title || "").toLowerCase().includes(q)
    );
  }, [photos, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const handlePageChange = (next) => {
    if (next < 1 || next > totalPages) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(next);
  };

  return (
    <div className="page-wrapper">
      <main className="page-inner">
        <header className="page-header">
          <h1 className="page-title">Explore Marketplace</h1>
          <p className="page-subtitle">
            Curated images from our public gallery and verified sellers. Login
            as a buyer to purchase and download.
          </p>
        </header>

        <div className="explore-search">
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {loading && <p>Loading images...</p>}

        {!loading && error && (
          <p style={{ color: "#b91c1c", marginTop: "0.75rem" }}>{error}</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ marginTop: "0.75rem" }}>
            No images found. Try a different search.
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <section className="explore-grid">
              {pageItems.map((photo) => (
                <ImageCard key={photo.id} photo={photo} />
              ))}
            </section>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
