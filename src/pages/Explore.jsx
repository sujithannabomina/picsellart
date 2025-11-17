// src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WatermarkedImage from "../components/WatermarkedImage";
import { useAuth } from "../context/AuthContext";
import { fetchAllExploreImages, filterAndPaginate } from "../utils/storage";
import { recordPurchase } from "../utils/purchases";
import { openCheckout } from "../utils/razorpay";

const ITEMS_PER_PAGE = 12;

const Explore = () => {
  const [allImages, setAllImages] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  const { user, isBuyer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const images = await fetchAllExploreImages();
        setAllImages(images);
      } catch (err) {
        console.error("Failed to load explore images:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const { items, totalPages } = useMemo(
    () => filterAndPaginate(allImages, search, page, ITEMS_PER_PAGE),
    [allImages, search, page]
  );

  const handleBuyClick = async (image) => {
    if (!user || !isBuyer) {
      navigate("/buyer-login", {
        state: { redirectTo: "/explore" },
      });
      return;
    }

    try {
      setBuyingId(image.id);
      const amount = image.price ?? 399; // in rupees, your utils can convert to paise
      const result = await openCheckout({
        amount,
        description: image.title || "Picsellart image",
        metadata: {
          fileName: image.fileName,
          storagePath: image.storagePath,
        },
      });

      if (result.success) {
        await recordPurchase({
          buyerId: user.uid,
          amount: result.amount,
          fileName: image.fileName,
          storagePath: image.storagePath,
          orderId: result.orderId,
        });
        alert("Payment successful! Check your downloads dashboard.");
        navigate("/buyer-dashboard");
      } else {
        alert("Payment was cancelled.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setBuyingId(null);
    }
  };

  const handleView = (image) => setSelectedImage(image);

  const closeModal = () => setSelectedImage(null);

  return (
    <main className="page-shell">
      <section className="page-header-block">
        <h1 className="page-title">Street Photography</h1>
        <p className="page-subtitle">
          Curated images from our public gallery and verified sellers. Login as
          a buyer to purchase and download.
        </p>

        <div className="explore-toolbar">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button
            className="btn-secondary"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
          >
            Clear
          </button>
        </div>
      </section>

      {loading && <div className="page-loading">Loading photos…</div>}

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <p>No images found. Try a different search.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <>
          <div className="explore-grid">
            {items.map((image) => (
              <article key={image.id} className="image-card">
                <div
                  className="image-card-thumb"
                  onClick={() => handleView(image)}
                >
                  <WatermarkedImage
                    src={image.previewUrl}
                    alt={image.title || image.fileName}
                    watermarkText="Picsellart"
                  />
                </div>
                <div className="image-card-body">
                  <div className="image-card-title-block">
                    <h3>{image.title || "Street Photography"}</h3>
                    <span className="price-pill">
                      ₹{image.price ?? 399}
                    </span>
                  </div>
                  <p className="image-card-filename">{image.fileName}</p>
                  <div className="image-card-actions">
                    <button
                      className="btn-secondary small"
                      onClick={() => handleView(image)}
                    >
                      View
                    </button>
                    <button
                      className="btn-primary small"
                      onClick={() => handleBuyClick(image)}
                      disabled={buyingId === image.id}
                    >
                      {buyingId === image.id ? "Processing…" : "Buy & Download"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                className="btn-secondary small"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn-secondary small"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <h2 className="modal-title">
              {selectedImage.title || "Preview"}
            </h2>
            <div className="modal-image-wrapper">
              <WatermarkedImage
                src={selectedImage.previewUrl}
                alt={selectedImage.title || selectedImage.fileName}
                watermarkText="Picsellart"
              />
            </div>
            <p className="modal-caption">
              Watermarked preview shown. Purchase to download the full
              resolution, clean image.
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Explore;
