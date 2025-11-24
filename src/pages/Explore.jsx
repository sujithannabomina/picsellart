// src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import WatermarkedImage from "../components/WatermarkedImage";

const PAGE_SIZE = 12;

async function fetchAllPhotos() {
  const folders = ["public/images", "seller-uploads"];
  const allItems = [];

  for (const folder of folders) {
    const folderRef = ref(storage, folder);
    try {
      const res = await listAll(folderRef);
      res.items.forEach((item) => {
        allItems.push({
          storagePath: `${folder}/${item.name}`,
          filename: item.name,
          ref: item,
        });
      });
    } catch (err) {
      // If a folder does not exist yet (e.g. seller-uploads), just ignore it
      if (process.env.NODE_ENV === "development") {
        console.warn(`Skipping folder ${folder}:`, err?.message);
      }
    }
  }

  // Resolve URLs
  const withUrls = await Promise.all(
    allItems.map(async (item) => {
      const url = await getDownloadURL(item.ref);
      // simple, safe default title/price; can be replaced later with Firestore metadata
      const baseName = item.filename.replace(/\.[^/.]+$/, "");
      return {
        id: item.storagePath,
        title: baseName.replace(/[-_]/g, " "),
        filename: item.filename,
        url,
        price: "₹199",
      };
    })
  );

  // Keep a stable order – public images first, then sellers
  return withUrls.sort((a, b) => a.filename.localeCompare(b.filename));
}

export default function Explore() {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchAllPhotos();
        if (!cancelled) setPhotos(data);
      } catch (err) {
        console.error("Failed to load photos:", err);
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
    const q = query.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.filename.toLowerCase().includes(q)
    );
  }, [photos, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <header className="page-header">
          <h1 className="page-title">Explore Marketplace</h1>
          <p className="page-subtitle">
            Curated images from our public gallery and verified sellers. Login as a buyer
            to purchase and download watermark-free files.
          </p>
        </header>

        <div className="explore-search">
          <input
            type="text"
            placeholder="Search street, interior, food, city..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {loading && <p>Loading images…</p>}

        {!loading && visible.length === 0 && (
          <p>No images found. Try a different keyword.</p>
        )}

        <div className="explore-grid">
          {visible.map((photo) => (
            <article key={photo.id} className="photo-card">
              <div className="photo-thumb">
                <WatermarkedImage src={photo.url} alt={photo.title} />
              </div>
              <div className="photo-info">
                <div>
                  <h3>{photo.title}</h3>
                  <p className="photo-filename">{photo.filename}</p>
                </div>
                <div className="photo-meta">
                  <span className="photo-price">{photo.price}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
