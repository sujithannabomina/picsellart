// src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuth } from "../hooks/useAuth";

// Builds sample items from storage public/images
async function loadSamplePublicImages() {
  const folderRef = ref(storage, "public/images");
  const res = await listAll(folderRef);

  const urls = await Promise.all(
    res.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        id: `sample_${itemRef.name}`,
        source: "sample",
        title: "Street Photography",
        filename: itemRef.name,
        price: 100 + Math.floor(Math.random() * 150),
        license: "Standard digital license",
        imageUrl: url,
      };
    })
  );

  return urls;
}

// Loads seller listings from Firestore
async function loadSellerListings() {
  const q = query(collection(db, "listings"), where("active", "==", true), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      source: "seller",
      title: data.title || "Untitled",
      filename: data.filename || "",
      price: Number(data.price || 0),
      license: "Standard digital license",
      imageUrl: data.previewUrl || data.imageUrl || "",
      sellerId: data.sellerId || "",
    };
  });
}

export default function Explore() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [qText, setQText] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 12;

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const [samples, sellers] = await Promise.all([loadSamplePublicImages(), loadSellerListings()]);

        // ✅ DEDUPE by id
        const map = new Map();
        for (const it of [...samples, ...sellers]) {
          if (!it?.id) continue;
          if (!map.has(it.id)) map.set(it.id, it);
        }

        const merged = Array.from(map.values());
        if (alive) setItems(merged);
      } catch (e) {
        console.error("Explore load error:", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const t = qText.trim().toLowerCase();
    if (!t) return items;

    return items.filter((it) => {
      const hay = `${it.title || ""} ${it.filename || ""}`.toLowerCase();
      return hay.includes(t);
    });
  }, [items, qText]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  function saveSelected(item) {
    try {
      sessionStorage.setItem("psa:selectedItem", JSON.stringify(item));
    } catch {}
  }

  function onView(item) {
    saveSelected(item);
    navigate(`/photo/${encodeURIComponent(item.id)}`);
  }

  function onBuy(item) {
    saveSelected(item);

    if (!user) {
      // remember where to return
      try {
        sessionStorage.setItem("psa:returnTo", `/checkout/${encodeURIComponent(item.id)}`);
      } catch {}
      navigate("/buyer-login");
      return;
    }

    navigate(`/checkout/${encodeURIComponent(item.id)}`);
  }

  return (
    <main className="page">
      <section className="page-head">
        <h1>Explore Marketplace</h1>
        <p className="muted">
          Curated images from our public gallery and verified sellers. Login as a buyer to purchase and download
          watermark-free files.
        </p>

        <div className="search-row">
          <input
            className="search"
            placeholder="Search street, interior, food..."
            value={qText}
            onChange={(e) => {
              setQText(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </section>

      {loading ? (
        <div className="muted" style={{ padding: 16 }}>
          Loading marketplace…
        </div>
      ) : (
        <>
          <section className="grid">
            {pageItems.map((it) => (
              <article key={it.id} className="card">
                <div className="card-img">
                  <img src={it.imageUrl} alt={it.title || "Photo"} loading="lazy" />
                  <div className="watermark">PICSELLART</div>
                </div>

                <div className="card-body">
                  {/* ✅ Removed “Picsellart sample / Seller upload” labels */}
                  <h3 className="card-title">{it.title || "Photo"}</h3>
                  <div className="card-sub muted">{it.filename}</div>

                  <div className="card-meta">
                    <div className="price">₹{it.price}</div>
                    <div className="license muted">{it.license}</div>
                  </div>

                  <div className="card-actions">
                    <button className="btn btn-small" onClick={() => onView(it)}>
                      View
                    </button>
                    <button className="btn btn-small btn-primary" onClick={() => onBuy(it)}>
                      Buy
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="pager">
            <button className="btn btn-small" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <div className="muted">
              Page {safePage} of {totalPages}
            </div>
            <button
              className="btn btn-small"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </section>
        </>
      )}
    </main>
  );
}
