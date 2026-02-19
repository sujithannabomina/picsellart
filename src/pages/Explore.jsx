// FILE PATH: src/pages/Explore.jsx
// ✅ PRODUCTION-READY with URL pagination, search, and all features

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import WatermarkedImage from "../components/WatermarkedImage";

export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Read page from URL
  const urlPage = parseInt(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [page, setPage] = useState(urlPage);
  const pageSize = 12;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch items from Firestore
  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        setLoading(true);
        setError("");
        
        const itemsRef = collection(db, "items");
        const q = query(itemsRef);
        const snapshot = await getDocs(q);

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
            // ✅ Tags support for search
            tags: data.tags || [],
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

  // ✅ Search filtering (title, fileName, tags)
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    
    return items.filter((x) => {
      const titleMatch = x.title.toLowerCase().includes(q);
      const fileMatch = x.fileName.toLowerCase().includes(q);
      const tagsMatch = x.tags.some(tag => 
        tag.toLowerCase().includes(q)
      );
      return titleMatch || fileMatch || tagsMatch;
    });
  }, [items, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // ✅ Sync page number with URL
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
      setSearchParams({ page: "1", search: searchQuery });
    }
  }, [page, totalPages, searchQuery, setSearchParams]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // ✅ Update URL when page changes
  const changePage = (newPage) => {
    setPage(newPage);
    const params = { page: String(newPage) };
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Update URL when search changes
  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
    const params = { page: "1" };
    if (value.trim()) params.search = value.trim();
    setSearchParams(params);
  };

  const onView = (it) => {
    navigate(`/photo/${encodeURIComponent(it.id)}`);
  };

  const onBuy = (it) => {
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
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by title, filename, or tags..."
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
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-600">No results found for "{searchQuery}"</p>
          <button 
            onClick={() => handleSearch("")} 
            className="mt-4 psa-btn-primary"
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          <div className="text-sm text-slate-600 mb-4">
            Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
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
                onClick={() => changePage(Math.max(1, page - 1))}
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
                onClick={() => changePage(Math.min(totalPages, page + 1))}
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