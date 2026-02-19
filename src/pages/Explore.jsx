// FILE PATH: src/pages/Explore.jsx
// ✅ COMPETITIVE VERSION - Recent seller uploads first, categories, advanced search

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import WatermarkedImage from "../components/WatermarkedImage";

// ✅ Predefined categories (Shutterstock-style)
const CATEGORIES = [
  { id: "all", label: "All Photos", icon: "🖼️" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "people", label: "People", icon: "👥" },
  { id: "technology", label: "Technology", icon: "💻" },
  { id: "food", label: "Food", icon: "🍽️" },
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "abstract", label: "Abstract", icon: "🎨" },
  { id: "architecture", label: "Architecture", icon: "🏛️" },
  { id: "animals", label: "Animals", icon: "🐾" },
  { id: "fashion", label: "Fashion", icon: "👗" },
  { id: "sports", label: "Sports", icon: "⚽" },
];

export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlPage = parseInt(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "all";
  const urlSort = searchParams.get("sort") || "newest";

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState(urlSort);
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
            category: data.category || "uncategorized",
            tags: data.tags || [],
            views: data.views || 0,
          };
        });

        // ✅ COMPETITIVE SORTING: Recent seller uploads first!
        fetchedItems.sort((a, b) => {
          // Priority 1: Seller uploads over samples
          if (a.type === "seller" && b.type === "sample") return -1;
          if (a.type === "sample" && b.type === "seller") return 1;
          
          // Priority 2: Within same type, sort by date (newest first)
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

  // ✅ Advanced filtering (search, category)
  const filtered = useMemo(() => {
    let result = [...items];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((x) => {
        const titleMatch = x.title.toLowerCase().includes(q);
        const fileMatch = x.fileName.toLowerCase().includes(q);
        const tagsMatch = x.tags.some(tag => tag.toLowerCase().includes(q));
        return titleMatch || fileMatch || tagsMatch;
      });
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(x => x.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        // Already sorted by newest (seller uploads first)
        break;
      case "popular":
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [items, searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
      updateURL(1, searchQuery, selectedCategory, sortBy);
    }
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // ✅ Update URL with all filters
  const updateURL = (newPage, search, category, sort) => {
    const params = { page: String(newPage) };
    if (search.trim()) params.search = search.trim();
    if (category !== "all") params.category = category;
    if (sort !== "newest") params.sort = sort;
    setSearchParams(params);
  };

  const changePage = (newPage) => {
    setPage(newPage);
    updateURL(newPage, searchQuery, selectedCategory, sortBy);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
    updateURL(1, value, selectedCategory, sortBy);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
    updateURL(1, searchQuery, categoryId, sortBy);
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    setPage(1);
    updateURL(1, searchQuery, selectedCategory, sortValue);
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="psa-title">Explore Marketplace</h1>
        <p className="psa-subtitle mt-1">
          Browse thousands of photos from Indian creators. Recent uploads shown first.
        </p>

        {/* Search Bar */}
        <div className="mt-4">
          <input
            className="psa-input"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by title, tags, or keywords..."
          />
        </div>
      </div>

      {/* ✅ Category Filters (Shutterstock-style) */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`
                flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap
                transition-all
                ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-slate-400"
                }
              `}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Sort & Filter Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-600">
          {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== "all" && ` in ${CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700 font-medium">Error loading photos</p>
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
              <div className="h-48 w-full rounded-2xl bg-slate-100 animate-pulse" />
              <div className="p-4">
                <div className="h-4 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 bg-slate-100 rounded animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-600">
            {searchQuery || selectedCategory !== "all"
              ? "No photos found. Try different filters."
              : "No photos yet. Be the first to upload!"}
          </p>
          {(searchQuery || selectedCategory !== "all") && (
            <button 
              onClick={() => {
                handleSearch("");
                handleCategoryChange("all");
              }} 
              className="mt-4 psa-btn-primary"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Photo Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pageItems.map((it) => (
              <div key={it.id} className="psa-card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-3">
                  {it.downloadUrl ? (
                    <WatermarkedImage
                      src={it.downloadUrl}
                      alt={it.title}
                      className="h-48 w-full"
                    />
                  ) : (
                    <div className="h-48 w-full rounded-2xl bg-slate-100 animate-pulse" />
                  )}
                </div>

                <div className="px-4 pb-4">
                  <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                    {it.title}
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-900">
                    ₹{it.price}
                  </div>
                  
                  {/* ✅ Badges */}
                  <div className="mt-2 flex items-center gap-2">
                    {it.type === "seller" && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Creator
                      </span>
                    )}
                    {it.category && it.category !== "uncategorized" && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {it.category}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      className="psa-btn-primary text-sm"
                      onClick={() => onView(it)}
                    >
                      View
                    </button>
                    <button
                      className="psa-btn-primary text-sm bg-blue-600 hover:bg-blue-700"
                      onClick={() => onBuy(it)}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                className="psa-btn-soft"
                onClick={() => changePage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>

              <div className="text-sm text-slate-600">
                Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
                <span className="font-semibold text-slate-900">{totalPages}</span>
              </div>

              <button
                className="psa-btn-soft"
                onClick={() => changePage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}