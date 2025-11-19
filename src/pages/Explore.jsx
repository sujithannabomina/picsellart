import { useEffect, useMemo, useState } from "react";
import { getAllPublicPhotos } from "../utils/storage";
import ImageCard from "../components/ImageCard";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 8;

export default function Explore() {
  const [photos, setPhotos] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const all = await getAllPublicPhotos();
        if (active) setPhotos(all);
      } catch (e) {
        console.error("Error loading photos", e);
        if (active) setError("Unable to load images right now.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return photos;
    return photos.filter((p) =>
      p.name.toLowerCase().includes(term)
    );
  }, [photos, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const currentPageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  return (
    <section className="pt-10 md:pt-12">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1">
          Explore Marketplace
        </h1>
        <p className="text-sm text-slate-600 max-w-xl">
          Curated images from our public gallery and verified sellers. Login as
          a buyer to purchase and download.
        </p>
      </header>

      <div className="mb-5 max-w-md">
        <input
          type="text"
          placeholder="Search images..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-transparent"
        />
      </div>

      {loading && (
        <p className="text-sm text-slate-600">Loading images...</p>
      )}
      {error && !loading && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-600">
              No images matched your search.
            </p>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {currentPageItems.map((photo) => (
                  <ImageCard key={photo.id} photo={photo} />
                ))}
              </div>
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onChange={setPage}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}
