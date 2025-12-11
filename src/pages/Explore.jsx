// src/pages/Explore.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

const ITEMS_PER_PAGE = 12;

const Explore = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // helper for random price
  const getRandomPrice = (min = 199, max = 499) => {
    return Math.round(
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  };

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      setError("");

      try {
        // 1. Sample images (your platform images)
        const publicRef = ref(storage, "public/images");
        const publicList = await listAll(publicRef);

        const publicPhotos = await Promise.all(
          publicList.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return {
              id: `public/images/${itemRef.name}`,
              folder: "public/images",
              fileName: itemRef.name,
              url,
              title: "Street Photography",
              price: getRandomPrice(),
              ownerType: "platform", // purchase earnings for you
            };
          })
        );

        // 2. Seller images (Buyer/ folder)
        const buyerRef = ref(storage, "Buyer");
        const buyerList = await listAll(buyerRef);

        const buyerPhotos = await Promise.all(
          buyerList.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return {
              id: `Buyer/${itemRef.name}`,
              folder: "Buyer",
              fileName: itemRef.name,
              url,
              title: "Street Photography",
              price: getRandomPrice(),
              ownerType: "seller", // purchase earnings for seller
            };
          })
        );

        const all = [...publicPhotos, ...buyerPhotos].sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );

        setPhotos(all);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error loading images from Firebase Storage", err);
        setError("Failed to load images.");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const filteredPhotos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.fileName.toLowerCase().includes(q)
    );
  }, [photos, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE)
  );

  const paginatedPhotos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPhotos.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredPhotos, currentPage]);

  const handleBuy = (photo) => {
    // For now, always send to Buyer Login
    navigate("/buyer-login");
  };

  const handleViewNewTab = (photo) => {
    const encodedFolder = encodeURIComponent(photo.folder);
    const encodedName = encodeURIComponent(photo.fileName);
    const url = `/view/${encodedFolder}/${encodedName}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50">
      <main className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Explore Marketplace
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Curated images from our public gallery and verified sellers.
            Login as a buyer to purchase and download watermark-free files.
          </p>
        </header>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search street, interior, food..."
            className="w-full max-w-md px-4 py-2 rounded-full border border-slate-300 bg-white shadow-sm text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {loading && (
          <div className="text-slate-600 text-sm">Loading images…</div>
        )}

        {error && !loading && (
          <div className="text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="text-slate-600 text-sm">
            No images found. Try a different search term.
          </div>
        )}

        {/* Image grid */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <>
            <section className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {paginatedPhotos.map((photo) => (
                <article
                  key={photo.id}
                  className="bg-white rounded-3xl shadow-md overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                    {/* Watermark overlay */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="text-white/70 text-xl md:text-2xl font-extrabold tracking-[0.3em] mix-blend-overlay rotate-[-20deg]">
                        PICSELLART
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 px-4 pt-4 pb-3 flex flex-col">
                    <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-1">
                      {photo.title}
                    </h2>
                    <p className="text-xs text-slate-500 mb-1">
                      {photo.fileName}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mb-3">
                      ₹{photo.price}
                      <span className="ml-1 text-xs text-slate-500">
                        {photo.ownerType === "platform"
                          ? "Picsellart sample"
                          : "Seller image"}
                      </span>
                    </p>

                    <div className="mt-auto flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewNewTab(photo)}
                        className="flex-1 px-3 py-2 text-xs md:text-sm rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBuy(photo)}
                        className="flex-1 px-3 py-2 text-xs md:text-sm rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-10">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  className={`px-3 py-1 text-xs md:text-sm rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-xs md:text-sm rounded-full border transition ${
                        page === currentPage
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  className={`px-3 py-1 text-xs md:text-sm rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Explore;
