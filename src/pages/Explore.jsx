// src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  listAll,
  ref as sref,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

const SAMPLE_COUNT = 112;
const SAMPLE_DIRS = ["public", "Buyer"]; // check both

const randomPrice = () => {
  // platform sample price buckets
  const buckets = [99, 149, 199, 249];
  return buckets[Math.floor(Math.random() * buckets.length)];
};

async function findSampleUrl(filename) {
  // tries "public/<file>" then "Buyer/<file>"
  for (const dir of SAMPLE_DIRS) {
    try {
      const r = sref(storage, `${dir}/${filename}`);
      const url = await getDownloadURL(r);
      return url;
    } catch {
      // keep looking in other dir
    }
  }
  return null;
}

async function loadAllSamples() {
  // use listAll only to quickly ensure folder exists (optional)
  // we directly look up known filenames for speed
  const items = [];
  const tasks = [];
  for (let i = 1; i <= SAMPLE_COUNT; i++) {
    const name = `sample${i}.jpg`;
    tasks.push(
      (async () => {
        const url = await findSampleUrl(name);
        if (url) {
          items.push({
            id: `sample-${i}`,
            title: "Street Photography",
            price: randomPrice(),
            watermarkedUrl: url,
            isSample: true,
            sellerId: "platform",
          });
        }
      })()
    );
  }
  await Promise.all(tasks);
  return items;
}

export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [qText, setQText] = useState("");
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const run = async () => {
      setBusy(true);
      try {
        // A) samples from Storage
        const samples = await loadAllSamples();

        // B) real uploads from Firestore (approved/public)
        const qRef = query(
          collection(db, "photos"),
          where("status", "==", "public"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(qRef);
        const live = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setItems([...samples, ...live]);
      } catch (err) {
        console.error("Explore load error:", err);
        setItems([]);
      } finally {
        setBusy(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    const t = qText.trim().toLowerCase();
    if (!t) return items;
    return items.filter((it) => {
      const hay =
        `${it.title ?? ""} ${
          Array.isArray(it.tags) ? it.tags.join(" ") : ""
        }`.toLowerCase();
      return hay.includes(t);
    });
  }, [qText, items]);

  const onBuy = (photo) => {
    if (!user) {
      navigate("/buyer/login");
      return;
    }
    navigate(`/photo/${photo.id}`, { state: { photo } });
  };

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Explore Pictures</h1>

        <div className="toolbar">
          <input
            className="input"
            placeholder="Search by title or tag..."
            value={qText}
            onChange={(e) => setQText(e.target.value)}
          />
        </div>

        {busy ? (
          <p>Loading…</p>
        ) : filtered.length === 0 ? (
          <p>No results.</p>
        ) : (
          <div className="grid">
            {filtered.map((p) => (
              <article key={p.id} className="photo-card">
                <div className="img-wrap">
                  <img
                    src={p.watermarkedUrl || p.url}
                    alt={p.title || "Untitled"}
                    loading="lazy"
                  />
                  <span className="wm">picsellart</span>
                </div>
                <div className="meta">
                  <div className="title">{p.title || "Untitled"}</div>
                  <div className="price">₹{p.price}</div>
                </div>
                <button className="btn primary w-full" onClick={() => onBuy(p)}>
                  Buy
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
