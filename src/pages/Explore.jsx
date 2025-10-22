// src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { createOrderClient, launchRazorpay } from "../utils/loadRazorpay";

const PAGE_SIZE = 24;
// Samples: sample1.jpg .. sample112.jpg under public/watermarked/
const SAMPLE_COUNT = 112;
const SAMPLE_PREFIX = "public/watermarked"; // change if your folder differs

function buildSampleRecords() {
  // Create lightweight descriptors; URLs are loaded lazily
  return Array.from({ length: SAMPLE_COUNT }, (_, i) => {
    const n = i + 1;
    return {
      id: `sample-${n}`,
      title: "street photography",
      isSample: true,
      storagePath: `${SAMPLE_PREFIX}/sample${n}.jpg`,
      price: randomPrice(), // random price for samples as requested
    };
  });
}
function randomPrice() {
  // choose a price in your allowed sample range (e.g., ₹99–₹249)
  const candidates = [99, 149, 199, 249];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [all, setAll] = useState([]);        // combined list
  const [page, setPage] = useState(1);
  const [qtext, setQtext] = useState("");
  const [loading, setLoading] = useState(true);
  const [urlCache, setUrlCache] = useState({}); // storagePath -> url

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 1) Build sample descriptors
        const samples = buildSampleRecords();

        // 2) Load user uploads (Firestore: photos where status == "active")
        const q1 = query(
          collection(db, "photos"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc"),
          limit(500) // adjust if needed
        );
        const snap = await getDocs(q1);
        const userPhotos = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || "Untitled",
            isSample: !!data.isSample,
            watermarkedUrl: data.watermarkedUrl || "",
            price: data.price ?? 0,
            ownerId: data.ownerId || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            createdAt: data.createdAt || null,
            // fallback if you follow a storage convention
            storagePath: data.watermarkedPath || "",
          };
        });

        // 3) Combine (samples first, then user uploads)
        const combined = [...samples, ...userPhotos];
        setAll(combined);
      } catch (e) {
        console.error(e);
        setAll([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Resolve a watermarked URL for a record
  async function ensureUrl(item) {
    if (item.watermarkedUrl) return item.watermarkedUrl;
    if (!item.storagePath) return "";

    if (urlCache[item.storagePath]) return urlCache[item.storagePath];
    try {
      const u = await getDownloadURL(ref(storage, item.storagePath));
      setUrlCache((m) => ({ ...m, [item.storagePath]: u }));
      return u;
    } catch (e) {
      console.warn("getDownloadURL failed:", item.storagePath, e);
      return "";
    }
  }

  // search + paginate in-memory
  const filtered = useMemo(() => {
    const t = qtext.trim().toLowerCase();
    if (!t) return all;
    return all.filter((it) => {
      const hay = `${it.title || ""} ${(it.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(t);
    });
  }, [all, qtext]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const view = filtered.slice(start, start + PAGE_SIZE);

  function goto(p) {
    setPage(Math.max(1, Math.min(pageCount, p)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleBuy(item) {
    if (!user) {
      navigate("/buyer/login");
      return;
    }
    try {
      const order = await createOrderClient({
        amount: Number(item.price) * 100,
        currency: "INR",
        userId: user.uid,
        purchaseType: "photo",
        photoId: item.id,
        sellerId: item.isSample ? "picsellart" : item.ownerId || "picsellart",
        title: item.title || "Photo",
        isSample: !!item.isSample,
      });
      await launchRazorpay({
        order,
        user,
        onSuccess: () => {
          alert("Payment successful! Your HD download will appear in Buyer Dashboard.");
          navigate("/buyer/dashboard");
        },
      });
    } catch (e) {
      console.error(e);
      alert("Could not start payment. Please try again.");
    }
  }

  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Explore</h1>
        <p className="page-desc">Browse Picsellart samples and community uploads.</p>

        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="Search by title or tag…"
            value={qtext}
            onChange={(e) => { setQtext(e.target.value); setPage(1); }}
            style={{ flex: 1 }}
          />
        </div>

        {loading ? (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-body">Loading photos…</div>
          </div>
        ) : view.length === 0 ? (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-body">No results.</div>
          </div>
        ) : (
          <>
            <div className="grid grid--4" style={{ marginTop: 16 }}>
              {view.map((it) => (
                <ExploreCard key={`${it.isSample ? "s" : "u"}-${it.id}`} item={it} getUrl={ensureUrl} onBuy={handleBuy} />
              ))}
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 8, justifyContent: "center" }}>
              <button className="btn" onClick={() => goto(page - 1)} disabled={page <= 1}>Prev</button>
              <div className="muted" style={{ padding: "8px 12px" }}>
                Page {page} / {pageCount}
              </div>
              <button className="btn" onClick={() => goto(page + 1)} disabled={page >= pageCount}>Next</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ExploreCard({ item, getUrl, onBuy }) {
  const [url, setUrl] = useState(item.watermarkedUrl || "");

  useEffect(() => {
    let alive = true;
    if (!url) {
      (async () => {
        const u = await getUrl(item);
        if (alive) setUrl(u);
      })();
    }
    return () => { alive = false; };
  }, [item, url, getUrl]);

  return (
    <div className="card">
      <div className="card-body">
        <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
          {url ? (
            <img src={url} alt={item.title} style={{ display: "block", width: "100%", height: 180, objectFit: "cover" }} />
          ) : (
            <div className="skeleton" style={{ height: 180 }} />
          )}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{item.title || "Untitled"}</div>
        <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
          ₹{item.price ?? 0} • {item.isSample ? "Picsellart" : "Seller"}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn--brand" onClick={() => onBuy(item)}>Buy</button>
          <a
            className="btn"
            href={`/photo/${encodeURIComponent(item.id)}`}
            onClick={(e) => {
              // your router likely uses state; if so, navigate programmatically elsewhere
              e.preventDefault();
              window.location.href = `/photo/${encodeURIComponent(item.id)}`;
            }}
          >
            Details
          </a>
        </div>
      </div>
    </div>
  );
}
