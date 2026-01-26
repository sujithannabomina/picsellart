import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import WatermarkedImage from "../components/WatermarkedImage";

/**
 * FIXES:
 * - View button works (goes to /photo/:id)
 * - Buy button logic:
 *   - if logged in -> /checkout
 *   - if not -> /buyer-login then redirect back to checkout
 * - No blank on back/refresh (ViewPhoto doesn’t rely on location.state)
 * - Sleek fonts + consistent blue buttons
 * - Removes any “extra marked text” by keeping UI clean/minimal
 */
export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const items = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 112; i++) {
      const fileName = `sample${i}.jpg`;
      const storagePath = `public/images/${fileName}`;
      arr.push({
        id: `sample-${encodeURIComponent(storagePath)}`,
        fileName,
        storagePath,
        title: "Street Photography",
        price: 119 + i,
      });
    }
    return arr;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (x) =>
        x.title.toLowerCase().includes(q) ||
        x.fileName.toLowerCase().includes(q) ||
        x.storagePath.toLowerCase().includes(q)
    );
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // Only fetch URLs for current page (fast + production-friendly)
  const [urlMap, setUrlMap] = useState({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const next = {};
      await Promise.all(
        pageItems.map(async (it) => {
          try {
            const url = await getDownloadURL(ref(storage, it.storagePath));
            next[it.id] = url;
          } catch {
            // fallback if needed (optional)
            next[it.id] = `/images/${it.fileName}`;
          }
        })
      );
      if (alive) setUrlMap((prev) => ({ ...prev, ...next }));
    })();
    return () => {
      alive = false;
    };
  }, [pageItems]);

  const onView = (it) => {
    // ✅ Always go to ViewPhoto route (stable)
    navigate(`/photo/${encodeURIComponent(it.id)}`);
  };

  const onBuy = (it) => {
    const checkoutUrl = `/checkout?type=sample&id=${encodeURIComponent(it.id)}`;
    if (user) {
      navigate(checkoutUrl);
    } else {
      navigate("/buyer-login", { state: { next: checkoutUrl } });
    }
  };

  return (
    <div className="psa-container">
      <div className="mb-6">
        <h1 className="psa-title">Explore Marketplace</h1>
        <p className="psa-subtitle mt-1">
          Browse watermarked previews. Buy to unlock the full file.
        </p>

        <div className="mt-4">
          <input
            className="psa-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search street, interior, food..."
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pageItems.map((it) => {
          const img = urlMap[it.id];
          return (
            <div key={it.id} className="psa-card overflow-hidden">
              <div className="p-3">
                {img ? (
                  <WatermarkedImage src={img} alt={it.title} className="h-44 w-full" />
                ) : (
                  <div className="h-44 w-full rounded-2xl bg-slate-100 animate-pulse" />
                )}
              </div>

              <div className="px-4 pb-4">
                <div className="text-sm font-semibold text-slate-900">{it.title}</div>
                <div className="mt-1 text-sm font-medium text-slate-900">₹{it.price}</div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="psa-btn-primary" onClick={() => onView(it)}>
                    View
                  </button>
                  <button className="psa-btn-primary" onClick={() => onBuy(it)}>
                    Buy
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          className="psa-btn-soft"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <div className="text-sm text-slate-600">
          Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
          <span className="font-semibold text-slate-900">{totalPages}</span>
        </div>

        <button
          className="psa-btn-soft"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
