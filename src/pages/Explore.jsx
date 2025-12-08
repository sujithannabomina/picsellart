import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// You currently have sample1–sample6 in /public/images.
// IDs 1–6 line up with /view/1 … /view/6.
const BASE_PHOTOS = [
  { id: 1, title: "sample1", fileName: "sample1.jpg", price: 199 },
  { id: 2, title: "sample2", fileName: "sample2.jpg", price: 199 },
  { id: 3, title: "sample3", fileName: "sample3.jpg", price: 199 },
  { id: 4, title: "sample4", fileName: "sample4.jpg", price: 199 },
  { id: 5, title: "sample5", fileName: "sample5.jpg", price: 199 },
  { id: 6, title: "sample6", fileName: "sample6.jpg", price: 199 },
];

const PHOTOS = BASE_PHOTOS.map((p) => ({
  ...p,
  src: `/images/${p.fileName}`,
}));

const Explore = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHOTOS;
    return PHOTOS.filter((photo) => {
      return (
        photo.title.toLowerCase().includes(q) ||
        photo.fileName.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Explore Marketplace
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Curated images from our public gallery and verified sellers. Login as
          a buyer to purchase and download watermark-free files.
        </p>

        {/* Search bar */}
        <div className="mt-6 max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search street, interior, food, city..."
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((photo) => (
            <article
              key={photo.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
            >
              {/* Clickable image – opens view page in new tab */}
              <Link
                to={`/view/${photo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-[4/5] overflow-hidden bg-slate-100"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </Link>

              <div className="flex flex-1 flex-col px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  {photo.title}
                </h2>
                <p className="text-xs text-slate-500">{photo.fileName}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-600">
                    ₹{photo.price}
                  </span>

                  <div className="flex gap-2">
                    {/* View button */}
                    <Link
                      to={`/view/${photo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>

                    {/* Buy button – goes to same view page where your buy flow lives */}
                    <Link
                      to={`/view/${photo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
                    >
                      Buy &amp; Download
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full mt-6 text-sm text-slate-500">
              No images match that search. Try a different keyword.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Explore;
