// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WatermarkedImage from "../components/WatermarkedImage";
import { useAuth } from "../context/AuthContext";
import {
  fetchAllExploreImages,
  filterAndPaginate,
} from "../utils/storage";
import { openPhotoCheckout } from "../utils/razorpay";
import { recordPurchase } from "../utils/purchases";

const PAGE_SIZE = 8;

const Explore = () => {
  const [allImages, setAllImages] = useState([]);
  const [pageData, setPageData] = useState({
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  const { user, role } = useAuth();
  const navigate = useNavigate();

  const isBuyer = user && role === "buyer";

  useEffect(() => {
    const load = async () => {
      try {
        const images = await fetchAllExploreImages();
        setAllImages(images);
      } catch (err) {
        console.error("Error loading explore images", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const result = filterAndPaginate(allImages, search, currentPage, PAGE_SIZE);
    setPageData(result);
  }, [allImages, search, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handleBuy = async (photo) => {
    if (!isBuyer) {
      // force buyer login first, then come back
      navigate("/buyer-login", {
        state: { redirectTo: "/explore", photoId: photo.id },
      });
      return;
    }

    try {
      setBuyingId(photo.id);
      await openPhotoCheckout({
        user,
        photo,
        onSuccess: async (paymentInfo) => {
          await recordPurchase(user.uid, photo, paymentInfo);
          alert("Payment successful! You can now download this image.");
        },
      });
    } catch (err) {
      console.error("Error during purchase", err);
      alert("Payment failed or was cancelled.");
    } finally {
      setBuyingId(null);
    }
  };

  if (loading) {
    return (
      <main className="page-wrapper">
        <div className="page-inner">
          <p>Loading photos…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper">
      <div className="page-inner">
        <header className="page-header">
          <h1 className="page-title">Street Photography</h1>
          <p className="page-subtitle">
            Curated images from our public gallery and verified sellers. Login
            as a buyer to purchase and download.
          </p>
        </header>

        <div className="explore-search">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={handleSearchChange}
          />
          <button onClick={handleClear}>Clear</button>
        </div>

        <section className="explore-grid">
          {pageData.items.map((photo) => (
            <article key={photo.id} className="photo-card">
              <div className="photo-thumb">
                <WatermarkedImage src={photo.url} alt={photo.name} />
              </div>
              <div className="photo-info">
                <div>
                  <h3>{photo.name}</h3>
                  <p className="photo-filename">{photo.fileName}</p>
                </div>
                <div className="photo-meta">
                  <span className="photo-price">₹{photo.price}</span>
                  <button
                    className="pill-button primary"
                    onClick={() => handleBuy(photo)}
                    disabled={buyingId === photo.id}
                  >
                    {buyingId === photo.id ? "Processing…" : "Buy & Download"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {pageData.totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={pageData.page === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span>
              Page {pageData.page} of {pageData.totalPages}
            </span>
            <button
              disabled={pageData.page === pageData.totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(pageData.totalPages, p + 1))
              }
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Explore;
