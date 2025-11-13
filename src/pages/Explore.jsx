// src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WatermarkedImage from "../components/WatermarkedImage";
import { useAuth } from "../context/AuthContext";
import { fetchAllExploreImages, filterAndPaginate } from "../utils/storage";
import { recordPurchase } from "../utils/purchases";
import { openCheckout } from "../utils/razorpay";

const PAGE_SIZE = 24; // internal page size – does not depend on exploreData.js

const Explore = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // we only depend on "user", not roles

  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  // load all explore images (from Firebase storage via utils/storage)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchAllExploreImages();
        if (!cancelled) {
          setAllImages(data || []);
        }
      } catch (err) {
        console.error("Error loading explore images", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // derive page items
  const { items: pageItems, totalPages, totalItems } = useMemo(() => {
    return filterAndPaginate(allImages, {
      search,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      page,
      pageSize: PAGE_SIZE,
    });
  }, [allImages, search, minPrice, maxPrice, page]);

  const handleNextPage = () => {
    if (totalPages && page < totalPages) {
      setPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBuy = async (image) => {
    // 1) Enforce login as Buyer (or at least logged-in user)
    if (!user) {
      alert("Please log in as a buyer to purchase images.");
      navigate("/buyer-login");
      return;
    }

    // 2) Figure out price in rupees from image metadata
    const rupees =
      image.displayPrice ??
      image.price ??
      image.basePrice ??
      399; // sensible fallback

    const amountPaise = Math.round(rupees * 100);

    // 3) Open Razorpay checkout using our helper
    await openCheckout({
      amount: amountPaise,
      name: "PicSellArt",
      description: image.name || "Photo purchase",
      image: "/logo.png",
      prefill: {
        name: user.displayName || "",
        email: user.email || "",
        contact: user.phoneNumber || "",
      },
      onSuccess: async (response) => {
        try {
          // 4) Record the purchase in Firestore for BuyerDashboard
          await recordPurchase({
            id: response.razorpay_payment_id,
            imageName: image.name,
            imageUrl: image.url,
            amount: amountPaise,
            buyerUid: user.uid,
            timestamp: Date.now(),
          });

          alert(
            "Payment successful! The download will now open in a new tab. You can also re-download from your Buyer Dashboard."
          );
          // 5) Direct download / view of that one image
          window.open(image.url, "_blank");
        } catch (err) {
          console.error("Error recording purchase", err);
          alert(
            "Payment captured, but we had trouble logging it. Please contact support with your payment ID."
          );
        }
      },
      onFailure: (err) => {
        console.error("Payment failed or dismissed", err);
        alert("Payment was cancelled or failed. You were not charged.");
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Explore Street Photography
          </h1>
          <p className="text-slate-600 mt-2">
            Curated images from your public folders and seller uploads. All
            listed photos are watermarked until purchase.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Showing {pageItems.length} of {totalItems} images
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            min="0"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => {
              setPage(1);
              setMinPrice(e.target.value);
            }}
            className="w-24 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            min="0"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => {
              setPage(1);
              setMaxPrice(e.target.value);
            }}
            className="w-24 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-slate-600 text-lg">Loading images…</p>
        </div>
      ) : pageItems.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <p className="text-slate-600 mb-3">
            No images match your current filters.
          </p>
          <button
            className="px-4 py-2 rounded-xl border border-slate-300 text-sm hover:bg-slate-50"
            onClick={() => {
              setSearch("");
              setMinPrice("");
              setMaxPrice("");
              setPage(1);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Grid of images */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {pageItems.map((img) => {
              const rupees =
                img.displayPrice ??
                img.price ??
                img.basePrice ??
                399;

              return (
                <div
                  key={img.id || img.url}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <WatermarkedImage
                      src={img.url}
                      alt={img.name}
                      watermarkText="PicSellArt"
                    />
                    <div className="absolute left-3 top-3 px-2 py-1 rounded-full bg-black/60 text-xs text-white">
                      streetphotography
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h2 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {img.name}
                      </h2>
                      <span className="text-sm font-bold text-indigo-600">
                        ₹{rupees}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">
                      High-resolution download, single commercial use license.
                      Watermark removed after purchase.
                    </p>
                    <button
                      onClick={() => handleBuy(img)}
                      className="mt-auto w-full px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                    >
                      Buy &amp; Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl border border-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </span>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl border border-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
