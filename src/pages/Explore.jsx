// src/pages/Explore.jsx

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import usePhotos from "../hooks/usePhotos"; // if your hook exists, this will work

export default function Explore() {
  const { photos = [], loading } = usePhotos?.() || { photos: [], loading: false };

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter((p) => {
      const name = (p?.name || p?.filename || "").toLowerCase();
      const title = (p?.title || "").toLowerCase();
      return name.includes(q) || title.includes(q);
    });
  }, [photos, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);

  const go = (n) => setPage(Math.min(totalPages, Math.max(1, n)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-900">Explore Marketplace</h1>
      <p className="mt-2 text-gray-600">
        Curated images from our public gallery and verified sellers. Login as a buyer to
        purchase and download watermark-free files.
      </p>

      <div className="mt-6">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search street, interior, food..."
          className="w-full max-w-xl rounded-full border px-5 py-3 outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>

      {loading ? (
        <div className="mt-10 text-gray-600">Loading images…</div>
      ) : (
        <>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pageItems.map((p) => {
              const file = p?.name || p?.filename || p?.fileName || "";
              const title = p?.title || "Street Photography";
              const price = p?.priceINR || p?.price || 120;

              return (
                <div
                  key={p?.id || file}
                  className="rounded-3xl border bg-white overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-gray-50">
                    <img
                      src={p?.url || p?.watermarkedUrl || `/photo/${file}`}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5">
                    <div className="font-semibold text-gray-900">{title}</div>
                    <div className="text-sm text-gray-500">{file}</div>

                    <div className="mt-2 font-bold text-gray-900">₹{price}</div>

                    <div className="mt-4 flex gap-3">
                      <Link
                        to={`/photo/${file}`}
                        className="flex-1 text-center rounded-full border px-4 py-2 font-semibold hover:bg-gray-50 transition"
                      >
                        View
                      </Link>
                      <Link
                        to={`/checkout?photo=${encodeURIComponent(file)}`}
                        className="flex-1 text-center rounded-full bg-purple-600 text-white px-4 py-2 font-semibold hover:bg-purple-700 transition"
                      >
                        Buy
                      </Link>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Standard digital license
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {filtered.length > PER_PAGE && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => go(safePage - 1)}
                disabled={safePage === 1}
                className="px-4 py-2 rounded-full border font-semibold disabled:opacity-40"
              >
                Prev
              </button>

              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{safePage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>

              <button
                onClick={() => go(safePage + 1)}
                disabled={safePage === totalPages}
                className="px-4 py-2 rounded-full border font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
