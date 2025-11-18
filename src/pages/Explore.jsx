import { useEffect, useMemo, useState } from "react";
import { getExploreImagesMeta, getImageUrlByPath } from "../utils/storage";
import ImageCard from "../components/ImageCard";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 8;

export default function Explore() {
  const [allMeta, setAllMeta] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState("");

  // Load all metadata once (fast, no URLs)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingMeta(true);
        const meta = await getExploreImagesMeta();
        if (!cancelled) {
          setAllMeta(meta);
          setError("");
        }
      } catch (err) {
        console.error("Error loading explore metadata", err);
        if (!cancelled) {
          setError("Unable to load images. Please refresh the page.");
        }
      } finally {
        if (!cancelled) {
          setLoadingMeta(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredMeta = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allMeta;
    return allMeta.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [allMeta, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMeta.length / PAGE_SIZE || 1)
  );

  // Load URLs only for current page
  useEffect(() => {
    if (!filteredMeta.length) {
      setVisiblePhotos([]);
      return;
    }

    let cancelled = false;

    const pageClamped = Math.min(page, totalPages);
    const start = (pageClamped - 1) * PAGE_SIZE;
    const slice = filteredMeta.slice(start, start + PAGE_SIZE);

    (async () => {
      try {
        setLoadingPage(true);
        const withUrls = await Promise.all(
          slice.map(async (item) => ({
            ...item,
            url: await getImageUrlByPath(item.fullPath),
          }))
        );
        if (!cancelled) {
          setVisiblePhotos(withUrls);
        }
      } catch (err) {
        console.error("Error loading page images", err);
        if (!cancelled) {
          setError("Some images failed to load. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoadingPage(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filteredMeta, page, totalPages]);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Explore Marketplace
        </h1>
        <p className="text-sm text-slate-500">
          Curated images from our public gallery and verified sellers.
          Login as a buyer to purchase and download.
        </p>
        <div className="mt-4 max-w-sm">
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
          />
        </div>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-2">
          {error}
        </p>
      )}

      {loadingMeta && !allMeta.length ? (
        <p className="text-sm text-slate-500">Loading images...</p>
      ) : !filteredMeta.length ? (
        <p className="text-sm text-slate-500">
          No images found. Try a different keyword.
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visiblePhotos.map((photo) => (
              <ImageCard key={photo.id} photo={photo} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(next) => !loadingPage && setPage(next)}
            />
            {loadingPage && (
              <p className="text-xs text-slate-500">Loading page…</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
