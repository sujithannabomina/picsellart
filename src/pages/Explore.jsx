// src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import WatermarkedImage from "../components/WatermarkedImage";

import { useAuth } from "../context/AuthContext";
import { openRazorpay } from "../utils/loadRazorpay";
import { fetchAllExploreImages, filterAndPaginate } from "../utils/storage";
import {
  DEFAULT_PAGE_SIZE,
  priceToINR,
  nextPage,
  prevPage,
} from "../utils/exploreData";

// Firestore (to record purchases for Buyer Dashboard)
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Explore() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [allImages, setAllImages] = useState([]); // full dataset from Storage
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [error, setError] = useState("");

  // Load from Firebase Storage (public/, Buyer/, and sellers/*/images/*)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const rows = await fetchAllExploreImages(); // must return [{name,url,price,title,source,path}]
        if (!cancelled) {
          setAllImages(rows);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Failed to load images. Please try again.");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply search + pagination
  const { total, totalPages, items } = useMemo(() => {
    return filterAndPaginate(allImages, { query, page, pageSize });
  }, [allImages, query, page, pageSize]);

  const clearSearch = () => {
    setQuery("");
    setPage(1);
  };

  const handleBuy = async (item) => {
    // If not logged in, send to buyer login page
    if (!user) {
      navigate("/buyer");
      return;
    }

    try {
      await openRazorpay({
        amount: item.price, // in INR
        user,
        // ⤵️ Record purchase so it shows in Buyer Dashboard
        onSuccess: async (resp) => {
          try {
            await addDoc(collection(db, "purchases"), {
              buyerUid: user.uid,
              buyerEmail: user.email || null,
              name: item.name,
              url: item.url,
              title: item.title,
              amount: item.price,
              source: item.source || null, // public / Buyer / seller
              paymentId: resp?.razorpay_payment_id || null,
              createdAt: serverTimestamp(),
            });
          } catch (e) {
            console.error("Failed to record purchase:", e);
          }

          // Temporary: direct download to the original file.
          // For a locked-down flow, gate seller originals behind a signed URL returned by your server after webhook verification.
          window.location.href = item.url;
        },
      });
    } catch (e) {
      console.error(e);
      alert("Payment could not be started. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Street Photography</h1>
          <p className="text-slate-600 mt-2">
            Curated images from our public gallery and verified sellers. Login as a buyer to
            purchase and download.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-2xl mb-6">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name..."
            className="flex-1 border rounded-md px-3 py-2"
          />
          <button onClick={clearSearch} className="px-3 py-2 border rounded-md">
            Clear
          </button>
        </div>

        {loading && <p>Loading images…</p>}
        {!loading && error && <p className="text-red-600">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-slate-600">No images found.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((img) => (
                <div
                  key={`${img.source}:${img.path || img.name}`}
                  className="border rounded-xl overflow-hidden bg-white"
                >
                  {/* Watermarked preview for Explore grid */}
                  <WatermarkedImage
                    src={img.url}
                    alt={img.name}
                    className="w-full aspect-[4/3] object-cover"
                    watermarkText="picsellart"
                  />

                  <div className="p-4">
                    <div className="text-xs text-slate-500">{img.title || "Street Photography"}</div>
                    <div className="font-semibold truncate">{img.name}</div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-slate-900 font-semibold">
                        {priceToINR(img.price)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1.5 rounded-md border"
                          onClick={() => window.open(img.url, "_blank")}
                          title="Open preview"
                        >
                          View
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-md bg-indigo-600 text-white"
                          onClick={() => handleBuy(img)}
                        >
                          Buy & Download
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      Source: {img.source || "public"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <button
                className="px-3 py-2 border rounded-md disabled:opacity-40"
                onClick={() => setPage((p) => prevPage(p))}
                disabled={page <= 1}
              >
                Prev
              </button>

              <div className="text-sm text-slate-600">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span> &middot;{" "}
                <span className="font-semibold">{total}</span> results
              </div>

              <button
                className="px-3 py-2 border rounded-md disabled:opacity-40"
                onClick={() => setPage((p) => nextPage(p, totalPages))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
