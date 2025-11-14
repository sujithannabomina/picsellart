// src/pages/Explore.jsx
import React, { useEffect, useState } from "react";
import WatermarkedImage from "../components/WatermarkedImage";
import { useAuth } from "../context/AuthContext";
import { fetchAllExploreImages, filterAndPaginate } from "../utils/storage";
import { recordPurchase } from "../utils/purchases";
import { openCheckout } from "../utils/razorpay";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 12;

export default function Explore() {
  const navigate = useNavigate();
  const { user, isBuyer } = useAuth();

  const [allImages, setAllImages] = useState([]);
  const [paginatedImages, setPaginatedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingBuyId, setLoadingBuyId] = useState(null);
  const [error, setError] = useState("");

  // Load all images once
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const images = await fetchAllExploreImages();

        if (!cancelled) {
          setAllImages(images);

          const { currentPageImages, totalPages: tp } = filterAndPaginate(
            images,
            searchTerm,
            1,
            PAGE_SIZE
          );

          setCurrentPage(1);
          setPaginatedImages(currentPageImages);
          setTotalPages(tp);
        }
      } catch (err) {
        console.error("Failed to load explore images", err);
        if (!cancelled) {
          setError("Unable to load images. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only once on mount

  // Refilter / repaginate when search or page changes
  useEffect(() => {
    if (!allImages.length) return;

    const { currentPageImages, totalPages: tp, currentPage: safePage } =
      filterAndPaginate(allImages, searchTerm, currentPage, PAGE_SIZE);

    setCurrentPage(safePage);
    setPaginatedImages(currentPageImages);
    setTotalPages(tp);
  }, [allImages, searchTerm, currentPage]);

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  function handleClearSearch() {
    setSearchTerm("");
    setCurrentPage(1);
  }

  function requireBuyerLogin() {
    if (!user) {
      // not logged in at all → send to buyer login
      navigate("/buyer-login", { state: { redirectTo: "/explore" } });
      return false;
    }

    // logged in, but maybe as seller only (if you distinguish in AuthContext)
    if (isBuyer === false) {
      alert("Please use a buyer account to purchase images.");
      return false;
    }

    return true;
  }

  async function handleBuy(image) {
    if (!requireBuyerLogin()) return;

    const price = Number(image.price || 0);
    if (!price || price <= 0) {
      alert("This image does not have a valid price yet.");
      return;
    }

    setLoadingBuyId(image.id);

    try {
      await openCheckout({
        amount: price, // IN RUPEES – we convert to paise inside openCheckout
        currency: image.currency || "INR",
        imageTitle: image.title,
        imageName: image.fileName,
        buyer: user,
        onSuccess: async (paymentResponse) => {
          try {
            await recordPurchase({
              userId: user.uid,
              imageId: image.id,
              imageName: image.fileName,
              imageUrl: image.url,
              price,
              currency: image.currency || "INR",
              paymentId: paymentResponse.razorpay_payment_id
            });

            // After successful purchase, immediately download that ONE image
            const link = document.createElement("a");
            link.href = image.url;
            link.download = image.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert("Payment successful! Your image is downloading.");
          } catch (err) {
            console.error("Failed to record purchase", err);
            alert(
              "Payment succeeded but we could not record the purchase. Please contact support with your payment ID."
            );
          }
        },
        onFailure: () => {
          alert("Payment was cancelled or failed. Please try again.");
        }
      });
    } finally {
      setLoadingBuyId(null);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Street Photography
        </h1>
        <p className="text-slate-600 mt-1">
          Curated images from our public gallery and verified sellers. Login as
          a buyer to purchase and download.
        </p>
      </header>

      <section className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/70 focus:border-transparent"
          />
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 text-sm rounded-full border border-slate-200 bg-white hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </section>

      {loading && (
        <p className="text-slate-500 text-sm">Loading images, please wait…</p>
      )}

      {error && (
        <p className="text-red-600 text-sm mb-4" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && paginatedImages.length === 0 && (
        <p className="text-slate-500 text-sm">
          No images found for this search.
        </p>
      )}

      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        {paginatedImages.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
              <WatermarkedImage src={image.url} alt={image.title} />
              <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase bg-black/50 text-white px-2 py-1 rounded-full">
                Picsellart
              </span>
            </div>

            <div className="px-4 py-3 flex flex-col gap-1">
              <h2 className="font-semibold text-slate-900 text-sm">
                {image.title}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {image.fileName}
              </p>
              <p className="text-sm font-semibold text-brand-purple mt-1">
                ₹{Number(image.price || 0).toLocaleString("en-IN")}
              </p>

              <button
                onClick={() => handleBuy(image)}
                disabled={loadingBuyId === image.id}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-900 text-white text-xs font-medium px-4 py-2 hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingBuyId === image.id ? "Processing…" : "Buy & Download"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs rounded-full border border-slate-200 bg-white disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs rounded-full border border-slate-200 bg-white disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}
