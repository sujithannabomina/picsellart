// src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const ITEMS_PER_PAGE = 12;

export default function Explore() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchFolder(folderPath, ownerLabel) {
      const folderRef = ref(storage, folderPath);
      const res = await listAll(folderRef);

      const items = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const randomPrice = Math.floor(Math.random() * 150) + 99; // ₹99–₹249
          return {
            id: `${ownerLabel}-${itemRef.fullPath}`,
            url,
            filename: itemRef.name,
            storagePath: itemRef.fullPath,
            title: "Street Photography",
            price: randomPrice,
            owner: ownerLabel,
          };
        })
      );

      return items;
    }

    async function loadAllImages() {
      try {
        setLoading(true);
        setError("");

        // 1) Picsellart sample images (public)
        const publicImages = await fetchFolder("public/images", "Picsellart sample");

        // 2) Buyer (or Seller) images – seller uploads mirrored here
        //    If you later create a "Seller" folder, simply change "Buyer" to "Seller".
        let sellerImages = [];
        try {
          sellerImages = await fetchFolder("Buyer", "Seller upload");
        } catch (sellerErr) {
          // If folder doesn't exist yet, just ignore – not a fatal error.
          console.warn("No Buyer folder yet or cannot read it:", sellerErr);
        }

        const combined = [...publicImages, ...sellerImages];

        // Sort by filename for stable order
        combined.sort((a, b) => a.filename.localeCompare(b.filename));

        setImages(combined);
        setPage(1);
      } catch (err) {
        console.error("Error loading images:", err);
        setError("Failed to load images.");
      } finally {
        setLoading(false);
      }
    }

    loadAllImages();
  }, []);

  // Filter by search text
  const filteredImages = useMemo(() => {
    if (!search.trim()) return images;
    const q = search.trim().toLowerCase();
    return images.filter(
      (img) =>
        img.filename.toLowerCase().includes(q) ||
        img.owner.toLowerCase().includes(q)
    );
  }, [images, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredImages.length / ITEMS_PER_PAGE)
  );

  const paginatedImages = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredImages.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredImages, page]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBuyClick = (image) => {
    // In production you would also pass image id via state or query.
    navigate("/buyer-login");
  };

  const handleViewClick = (image) => {
    setSelectedImage(image);
  };

  const gridWrapperStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2.5rem 1.5rem 3rem",
  };

  const headingStyle = {
    fontSize: "1.7rem",
    fontWeight: 700,
    marginBottom: "0.4rem",
  };

  const subHeadingStyle = {
    fontSize: "0.95rem",
    color: "#6b7280",
    marginBottom: "1.4rem",
  };

  const searchInputStyle = {
    width: "100%",
    maxWidth: "420px",
    padding: "0.55rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.9)",
    fontSize: "0.9rem",
    outline: "none",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
    display: "flex",
    flexDirection: "column",
  };

  const previewWrapperStyle = {
    position: "relative",
    width: "100%",
    paddingTop: "70%", // aspect ratio
    overflow: "hidden",
  };

  const previewImgStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const watermarkStyle = {
    position: "absolute",
    bottom: "10px",
    right: "12px",
    padding: "3px 8px",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.75)",
    color: "#f9fafb",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  };

  const cardBodyStyle = {
    padding: "0.75rem 0.95rem 0.9rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  };

  const badgeStyle = {
    display: "inline-block",
    fontSize: "0.7rem",
    padding: "2px 8px",
    borderRadius: "999px",
    background: "rgba(129, 140, 248, 0.12)",
    color: "#4f46e5",
    marginBottom: "0.25rem",
  };

  const priceRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.15rem",
  };

  const actionsRowStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.45rem",
    marginTop: "0.55rem",
  };

  const ghostButtonStyle = {
    padding: "0.35rem 0.9rem",
    fontSize: "0.8rem",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.8)",
    background: "transparent",
    cursor: "pointer",
  };

  const primaryButtonStyle = {
    ...ghostButtonStyle,
    border: "none",
    background:
      "linear-gradient(90deg, rgba(129,140,248,1) 0%, rgba(236,72,153,1) 100%)",
    color: "#fff",
  };

  const paginationRowStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.75rem",
    marginTop: "2rem",
  };

  const paginationButtonStyle = {
    padding: "0.35rem 0.75rem",
    fontSize: "0.8rem",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.9)",
    background: "white",
    cursor: "pointer",
  };

  const modalOverlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.70)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  };

  const modalContentStyle = {
    background: "#f9fafb",
    borderRadius: "18px",
    maxWidth: "900px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(15,23,42,0.55)",
    display: "flex",
    flexDirection: "column",
  };

  const modalImageWrapper = {
    position: "relative",
    width: "100%",
    paddingTop: "60%",
    background: "#000",
  };

  const modalWatermarkStyle = {
    ...watermarkStyle,
    bottom: "14px",
    right: "18px",
  };

  const modalBodyStyle = {
    padding: "0.9rem 1.1rem 1.1rem",
    fontSize: "0.9rem",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "12px",
    border: "none",
    borderRadius: "999px",
    padding: "0.25rem 0.55rem",
    cursor: "pointer",
    fontSize: "0.8rem",
  };

  return (
    <main>
      <section style={gridWrapperStyle}>
        <h1 style={headingStyle}>Explore Marketplace</h1>
        <p style={subHeadingStyle}>
          Curated images from our public gallery and verified sellers. Login as a
          buyer to purchase and download watermark-free files.
        </p>

        <input
          type="text"
          placeholder="Search street, interior, food…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={searchInputStyle}
        />

        {loading && <p style={{ marginTop: "1.5rem" }}>Loading images…</p>}
        {error && !loading && (
          <p style={{ marginTop: "1.5rem", color: "#b91c1c" }}>{error}</p>
        )}

        {!loading && !error && paginatedImages.length === 0 && (
          <p style={{ marginTop: "1.5rem" }}>No images match your search.</p>
        )}

        {!loading && !error && paginatedImages.length > 0 && (
          <>
            <div style={gridStyle}>
              {paginatedImages.map((image) => (
                <article key={image.id} style={cardStyle}>
                  <div style={previewWrapperStyle}>
                    <img
                      src={image.url}
                      alt={image.filename}
                      style={previewImgStyle}
                    />
                    <div style={watermarkStyle}>Picsellart</div>
                  </div>
                  <div style={cardBodyStyle}>
                    <span style={badgeStyle}>{image.owner}</span>
                    <h3
                      style={{
                        margin: "0 0 0.15rem",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                      }}
                    >
                      {image.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8rem",
                        color: "#6b7280",
                      }}
                    >
                      {image.filename}
                    </p>

                    <div style={priceRowStyle}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        ₹{image.price}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                        }}
                      >
                        Standard digital license
                      </span>
                    </div>

                    <div style={actionsRowStyle}>
                      <button
                        type="button"
                        style={ghostButtonStyle}
                        onClick={() => handleViewClick(image)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        style={primaryButtonStyle}
                        onClick={() => handleBuyClick(image)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div style={paginationRowStyle}>
              <button
                type="button"
                style={paginationButtonStyle}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                ‹ Prev
              </button>
              <span style={{ fontSize: "0.85rem" }}>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                style={paginationButtonStyle}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next ›
              </button>
            </div>
          </>
        )}
      </section>

      {/* VIEW MODAL */}
      {selectedImage && (
        <div
          style={modalOverlayStyle}
          onClick={() => setSelectedImage(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalImageWrapper}>
              <img
                src={selectedImage.url}
                alt={selectedImage.filename}
                style={previewImgStyle}
              />
              <div style={modalWatermarkStyle}>Picsellart</div>
              <button
                type="button"
                style={closeButtonStyle}
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
            <div style={modalBodyStyle}>
              <p
                style={{
                  margin: "0 0 0.2rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {selectedImage.title}
              </p>
              <p
                style={{
                  margin: "0 0 0.3rem",
                  fontSize: "0.85rem",
                  color: "#6b7280",
                }}
              >
                {selectedImage.filename} • {selectedImage.owner}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                }}
              >
                Price: <strong>₹{selectedImage.price}</strong> (standard digital
                license, watermark-free after purchase).
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
