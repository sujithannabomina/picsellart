// src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchAllExploreImages, filterAndPaginate } from "../utils/storage";
import { DEFAULT_PAGE_SIZE, nextPage, prevPage, priceToINR } from "../utils/exploreData";
import { openRazorpay } from "../utils/loadRazorpay";
import { useAuth } from "../context/AuthContext";

export default function Explore() {
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = DEFAULT_PAGE_SIZE;

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const items = await fetchAllExploreImages();
      setAll(items);
      setLoading(false);
    })();
  }, []);

  const { items, total } = useMemo(
    () => filterAndPaginate(all, { q, page, pageSize }),
    [all, q, page, pageSize]
  );

  async function handleBuy(item) {
    // Force Buyer login
    if (!user) {
      navigate("/buyer");
      return;
    }
    // 1) Create order on your backend
    const res = await fetch("/api/createPhotoOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: item.path, name: item.name, price: item.price }),
    });
    if (!res.ok) {
      alert("Unable to create order");
      return;
    }
    const order = await res.json(); // { id, key, amount, currency }

    // 2) Open Razorpay and 3) verify -> receive secure download URL
    await openRazorpay({
      order,
      prefill: {}, // you can use user.email if you store it in profile
      onSuccess: async (payment) => {
        const verify = await fetch("/api/verifyPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment, path: item.path }),
        });
        if (verify.ok) {
          const { downloadUrl } = await verify.json();
          window.location.href = downloadUrl;
        } else {
          alert("Payment verification failed");
        }
      },
    });
  }

  return (
    <>
      <Header />
      <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
        <h1 style={{ fontSize: 32, marginBottom: 4 }}>Street Photography</h1>
        <p style={{ color: "#6b7280", marginBottom: 12 }}>
          Curated images from our public gallery and verified sellers. Login as a buyer to purchase and download.
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            value={q}
            onChange={(e) => { setPage(1); setQ(e.target.value); }}
            placeholder="Search by name…"
            style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
          />
          <button className="btn ghost" onClick={() => { setQ(""); setPage(1); }}>Clear</button>
        </div>

        {loading ? (
          <p>Loading images…</p>
        ) : (
          <>
            <p style={{ color: "#6b7280", marginBottom: 8 }}>
              Showing {items.length} of {total}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {items.map((img) => (
                <div
                  key={img.id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 10,
                    padding: 8,
                    background: "#fff",
                  }}
                >
                  <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
                    <img
                      src={img.url}
                      alt={img.name}
                      style={{ width: "100%", height: 200, objectFit: "cover" }}
                    />
                    {/* Visible text watermark on preview */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        color: "rgba(255,255,255,0.85)",
                        fontWeight: 800,
                        letterSpacing: 4,
                        textTransform: "uppercase",
                        textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                        userSelect: "none",
                        pointerEvents: "none",
                        background:
                          "linear-gradient(0deg, rgba(0,0,0,0.06), rgba(0,0,0,0.06))",
                      }}
                      aria-hidden
                    >
                      PICSELLART
                    </div>
                  </div>

                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{img.name}</div>
                    <div style={{ color: "#111827", marginBottom: 8 }}>
                      {priceToINR(img.price)}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn" onClick={() => handleBuy(img)}>
                        {user ? "Buy & Download" : "Login to Buy"}
                      </button>
                      <a className="btn ghost" href={`/photo/${encodeURIComponent(img.name)}`}>
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
              <button className="btn ghost" onClick={() => setPage((p) => prevPage(p))}>
                Prev
              </button>
              <button
                className="btn ghost"
                onClick={() => setPage((p) => nextPage(p, total, pageSize))}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
