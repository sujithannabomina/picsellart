// FILE PATH: src/pages/Explore.jsx
// ✅ FIXED: Queries Firestore items WITHOUT orderBy (no index needed)

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import WatermarkedImage from "../components/WatermarkedImage";

export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // ✅ Fetch items from Firestore
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        setLoading(true);
        setError("");
        
        const itemsRef = collection(db, "items");
        
        // ✅ FIXED: Removed orderBy to avoid needing index
        const q = query(itemsRef);
        const snapshot = await getDocs(q);

        console.log("Fetched items count:", snapshot.size); // Debug log

        const fetchedItems = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            fileName: data.fileName || "",
            storagePath: data.storagePath || "",
            title: data.displayName || data.fileName || "Photo",
            price: data.price || 0,
            downloadUrl: data.downloadUrl || "",
            uploadedBy: data.uploadedBy || "platform",
            type: data.type || "sample",
            createdAt: data.createdAt || null,
          };
        });

        // ✅ Sort in JavaScript (newest first)
        fetchedItems.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });

        if (!cancelled) {
          setItems(fetchedItems);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        if (!cancelled) {
          setError(err.message || "Failed to load items");
          setItems([]);
          setLoading(false);
        }
      }
    }

    fetchItems();
    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ Search filtering
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (x) =>
        x.title.toLowerCase().includes(q) ||
        x.fileName.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const onView = (it) => {
    navigate(`/photo/${encodeURIComponent(it.id)}`);
  };

  const onBuy = (it) => {
    // ✅ Pass complete info to checkout
    const checkoutUrl =
      `/checkout?type=${it.type}` +
      `&id=${encodeURIComponent(it.id)}` +
      `&amount=${encodeURIComponent(String(it.price))}`;

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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search photos..."
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700 font-medium">Error loading items</p>
          <p className="text-sm text-red-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 psa-btn-primary"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="psa-card overflow-hidden">
              <div className="h-44 w-full rounded-2xl bg-slate-100 animate-pulse" />
              <div className="p-4">
                <div className="h-4 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 bg-slate-100 rounded animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-600">No items found. Upload some photos to get started!</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-slate-600 mb-4">
            Showing {filtered.length} items
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pageItems.map((it) => (
              <div key={it.id} className="psa-card overflow-hidden">
                <div className="p-3">
                  {it.downloadUrl ? (
                    <WatermarkedImage
                      src={it.downloadUrl}
                      alt={it.title}
                      className="h-44 w-full"
                    />
                  ) : (
                    <div className="h-44 w-full rounded-2xl bg-slate-100 animate-pulse" />
                  )}
                </div>

                <div className="px-4 pb-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {it.title}
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    ₹{it.price}
                  </div>
                  
                  {/* ✅ Show badge for seller uploads */}
                  {it.type === "seller" && (
                    <div className="mt-2 text-xs text-slate-500">
                      Seller Upload
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      className="psa-btn-primary"
                      onClick={() => onView(it)}
                    >
                      View
                    </button>
                    <button
                      className="psa-btn-primary"
                      onClick={() => onBuy(it)}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                className="psa-btn-soft"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>

              <div className="text-sm text-slate-600">
                Page <span className="font-semibold text-slate-900">{page}</span>{" "}
                of <span className="font-semibold text-slate-900">{totalPages}</span>
              </div>

              <button
                className="psa-btn-soft"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
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
