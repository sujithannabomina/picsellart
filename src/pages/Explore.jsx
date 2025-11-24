// src/pages/Explore.jsx
import React, { useMemo, useState } from "react";
import { explorePhotos } from "../utils/exploreData";
import ImageCard from "../components/ImageCard";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 12;

const Explore = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return explorePhotos;

    return explorePhotos.filter(
      (photo) =>
        photo.title.toLowerCase().includes(term) ||
        photo.filename.toLowerCase().includes(term)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <header className="page-header">
          <h1 className="page-title">Explore Marketplace</h1>
          <p className="page-subtitle">
            Curated images from our public gallery and verified sellers. Login
            as a buyer to purchase and download watermark-free files.
          </p>
        </header>

        <div className="explore-search">
          <input
            type="text"
            placeholder="Search street, interior, food, city..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <div className="explore-grid">
          {pageItems.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Explore;
