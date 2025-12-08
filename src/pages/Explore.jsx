// src/pages/Explore.jsx
import React, { useMemo, useState } from "react";
import { usePhotos } from "../hooks/usePhotos";

export default function Explore() {
  const { photos, loading, error } = usePhotos();
  const [search, setSearch] = useState("");

  const filteredPhotos = useMemo(() => {
    const list = photos || [];
    const q = search.trim().toLowerCase();

    if (!q) return list;

    return list.filter((photo) => {
      const title = photo.title ? photo.title.toLowerCase() : "";
      const filename = photo.filename ? photo.filename.toLowerCase() : "";
      return title.includes(q) || filename.includes(q);
    });
  }, [photos, search]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Header */}
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Explore Marketplace
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
            Curated images from our public gallery and verified sellers. Login
            as a buyer to purchase and download watermark-free files.
          </p>

          <div className="mt-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search street, interior, food, city..."
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
        </header>

        {/* Loading / error states */}
        {loading && (
          <p className="text-sm text-slate-500">Loading images…</p>
        )}
        {error && !loading && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* Cards grid */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => (
              <article
                key={photo.id}
                className="flex flex-col rounded-3xl bg-white shadow-md shadow-slate-200 overflow-hidden"
              >
                {/* Image – opens /view/:id in NEW TAB */}
                <a
                  href={`/view/${photo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {photo.imageUrl ? (
                    <img
                      src={photo.imageUrl}
                      alt={photo.title || photo.filename || "Photo"}
                      className="h-56 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-56 w-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                      No preview
                    </div>
                  )}
                </a>

                <div className="flex-1 px-4 pt-3 pb-4 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-slate-900">
                      {photo.title || "Street Photography"}
                    </h2>
                    {photo.filename && (
                      <p className="text-xs text-slate-500">
                        {photo.filename}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-emerald-600">
                      ₹{photo.price ?? 199}
                    </span>

                    {/* Explicit View button – NEW TAB */}
                    <a
                      href={`/view/${photo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition"
                    >
                      View
                    </a>
                  </div>
                </div>
              </article>
            ))}

            {!filteredPhotos.length && !loading && (
              <p className="text-sm text-slate-500 col-span-full">
                No images match your search yet.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
