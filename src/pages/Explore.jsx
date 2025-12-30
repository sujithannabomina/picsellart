// src/pages/Explore.jsx
import React, { useMemo, useState } from "react";
import usePhotos from "../hooks/usePhotos";

const ITEMS_PER_PAGE = 12;

const Explore = () => {
  const { items, loading } = usePhotos();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const t = (it.title || "").toLowerCase();
      const f = (it.filename || "").toLowerCase();
      return t.includes(q) || f.includes(q);
    });
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const pageItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  // keep page in range
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  return (
    <div className="page page-explore">
      <h1 className="explore-heading">Explore Marketplace</h1>
      <p className="explore-subtitle">
        Curated images from our public gallery and verified sellers. Login as a buyer to purchase and
        download watermark-free files.
      </p>

      <input
        className="explore-search-input"
        placeholder="Search street, interior, food..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {loading ? (
        <div className="card">Loading images…</div>
      ) : (
        <>
          <div className="image-grid">
            {pageItems.map((it) => (
              <div className="image-card" key={it.id}>
                <img src={it.url} alt={it.title || "Image"} loading="lazy" />
                <div className="image-card-body">
                  {/* NO "Picsellart sample" / "Seller upload" labels */}
                  <div className="image-card-title">{it.title || "Photo"}</div>
                  <div style={{ marginTop: 4, color: "#6b7280", fontSize: "0.85rem" }}>
                    {it.filename || ""}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700 }}>₹{it.price}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>{it.license}</div>
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="btn btn-nav">View</button>
                    <button className="btn btn-nav-primary">Buy</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18 }}>
            <button
              className="btn btn-nav"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{ opacity: page <= 1 ? 0.5 : 1 }}
            >
              Prev
            </button>

            <div style={{ alignSelf: "center", color: "#4b5563" }}>
              Page {page} of {totalPages}
            </div>

            <button
              className="btn btn-nav"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{ opacity: page >= totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Explore;
