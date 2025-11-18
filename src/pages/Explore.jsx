// src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPhotoIndex, fetchPhotoUrl } from "../utils/storage";

const PER_PAGE = 8;

export default function Explore() {
  const [allPhotos, setAllPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [indexLoading, setIndexLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [urlCache, setUrlCache] = useState({}); // storagePath -> downloadURL
  const [error, setError] = useState("");

  // Load the lightweight index from Firebase once
  useEffect(() => {
    let cancelled = false;

    async function loadIndex() {
      try {
        setIndexLoading(true);
        const index = await fetchPhotoIndex();
        if (!cancelled) {
          setAllPhotos(index);
          setError("");
        }
      } catch (err) {
        console.error("Error loading photo index:", err);
        if (!cancelled) {
          setError("Unable to load images right now. Please try again.");
        }
      } finally {
        if (!cancelled) setIndexLoading(false);
      }
    }

    loadIndex();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter by search
  const filteredPhotos = useMemo(() => {
    if (!searchTerm.trim()) return allPhotos;
    const term = searchTerm.toLowerCase();
    return allPhotos.filter(
      (photo) =>
        photo.fileName.toLowerCase().includes(term) ||
        photo.title.toLowerCase().includes(term)
    );
  }, [allPhotos, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / PER_PAGE));

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    return filteredPhotos.slice(start, end);
  }, [filteredPhotos, currentPage]);

  // Ensure currentPage is valid if filter changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Load URLs only for current page items
  useEffect(() => {
    if (currentPageItems.length === 0) return;
    let cancelled = false;

    async function loadUrlsForPage() {
      try {
        setPageLoading(true);
        const updates = {};

        await Promise.all(
          currentPageItems.map(async (photo) => {
            if (!urlCache[photo.storagePath]) {
              try {
                const url = await fetchPhotoUrl(photo.storagePath);
                updates[photo.storagePath] = url;
              } catch (err) {
                console.error("Error getting URL for", photo.storagePath, err);
              }
            }
          })
        );

        if (!cancelled && Object.keys(updates).length > 0) {
          setUrlCache((prev) => ({ ...prev, ...updates }));
        }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    }

    loadUrlsForPage();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageItems]);

  const handlePrev = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const showSkeletons =
    indexLoading || (pageLoading && currentPageItems.length === 0);

  return (
    <div className="min-h-screen bg-slate-100 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Explore Marketplace
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Curated images from our public gallery and verified sellers. Login
            as a buyer to purchase and download.
          </p>
          <div className="mt-6 max-w-md">
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {showSkeletons &&
            Array.from({ length: PER_PAGE }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="flex flex-col rounded-3xl bg-white p-4 shadow-lg shadow-slate-200/80"
              >
                <div className="mb-4 h-48 w-full animate-pulse rounded-2xl bg-slate-200" />
                <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="mb-4 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                <div className="mt-auto flex gap-2">
                  <div className="h-9 flex-1 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-9 flex-1 animate-pulse rounded-full bg-slate-200" />
                </div>
              </div>
            ))}

          {!showSkeletons &&
            currentPageItems.map((photo) => {
              const url = urlCache[photo.storagePath];

              return (
                <article
                  key={photo.id}
                  className="flex flex-col rounded-3xl bg-white p-4 shadow-lg shadow-slate-200/80"
                >
                  <div className="relative mb-4 overflow-hidden rounded-2xl bg-slate-900">
                    {url ? (
                      <img
                        src={url}
                        alt={photo.title}
                        loading="lazy"
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="h-48 w-full animate-pulse bg-slate-200" />
                    )}

                    {/* Strong watermark overlay */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="select-none text-3xl font-black tracking-[0.4em] text-white/45 mix-blend-soft-light rotate-[-26deg]">
                        PICSELLART
                      </span>
                    </div>
                  </div>

                  <h2 className="text-sm font-semibold text-slate-900">
                    {photo.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {photo.fileName}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    ₹{photo.price}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      to={`/view/${encodeURIComponent(photo.storagePath)}`}
                      className="flex-1 rounded-full border border-slate-900/10 bg-white px-3 py-2 text-center text-xs font-medium text-slate-900 shadow-sm transition hover:border-slate-900/40 hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      className="flex-1 rounded-full bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white shadow-md shadow-slate-900/30 transition hover:bg-slate-800"
                    >
                      Buy &amp; Download
                    </button>
                  </div>
                </article>
              );
            })}

          {!indexLoading && !filteredPhotos.length && !error && (
            <p className="col-span-full text-sm text-slate-500">
              No images found for “{searchTerm}”.
            </p>
          )}
        </div>

        {/* Pagination */}
        {!indexLoading && filteredPhotos.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-4 text-xs text-slate-600">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <span>
              Page <span className="font-semibold">{currentPage}</span> /{" "}
              <span className="font-semibold">{totalPages}</span>
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
