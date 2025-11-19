// src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExplorePage } from "../utils/storage";

const PAGE_SIZE = 8;

export default function Explore() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const { total, items } = await getExplorePage(page, PAGE_SIZE);
        if (!ignore) {
          setTotal(total);
          setPhotos(items);
        }
      } catch (err) {
        console.error("Error loading explore photos", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [page]);

  const filtered = useMemo(() => {
    if (!search.trim()) return photos;
    const q = search.toLowerCase();
    return photos.filter(
      (p) =>
        p.fileName.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
    );
  }, [photos, search]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <button
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <span className="h-3 w-3 rounded-full bg-violet-500 shadow" />
            <span className="text-lg font-semibold tracking-tight">
              Picsellart
            </span>
          </button>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
            <button onClick={() => navigate("/explore")}>Explore</button>
            <button onClick={() => navigate("/faq")}>FAQ</button>
            <button onClick={() => navigate("/contact")}>Contact</button>
            <button onClick={() => navigate("/refunds")}>Refunds</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/buyer-login")}
              className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Buyer Login
            </button>
            <button
              onClick={() => navigate("/seller-login")}
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-violet-200 hover:brightness-110"
            >
              Seller Login
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <section className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Explore Marketplace
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Curated images from our public gallery and verified sellers. Login
            as a buyer to purchase and download.
          </p>
        </section>

        <div className="mb-6 max-w-md">
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm outline-none shadow-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {loading ? (
          <p className="text-sm text-slate-600">Loading images...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-600">
            No images found for your search on this page.
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((photo) => (
                <article
                  key={photo.id}
                  className="flex flex-col rounded-3xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative mb-3 overflow-hidden rounded-2xl bg-slate-200">
                    <div className="aspect-[4/3]">
                      <img
                        src={photo.url}
                        alt={photo.fileName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Strong, visible watermark */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="text-white/80 text-2xl font-semibold tracking-[0.4em] drop-shadow-lg">
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

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/view/${photo.id}`)}
                      className="flex-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate("/buyer-login")}
                      className="flex-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      Buy &amp; Download
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination – 8 images per page */}
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-700">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-full border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-full border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
