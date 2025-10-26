import { useEffect, useMemo, useState } from "react";

/**
 * Robust Explore loader:
 * 1) Tries Firestore client (if your /src/lib/firebase.js exists and is configured)
 * 2) Falls back to your serverless endpoint that returns a public sample
 * 3) Final fallback shows an empty grid with a helpful message
 */
export default function Explore() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      // Try Firestore (if present)
      try {
        const { getFirestore, collection, query, orderBy, getDocs } = await import("firebase/firestore");
        const { app } = await import("../lib/firebase.js"); // your existing file
        const db = getFirestore(app);

        const col = collection(db, "photos_public"); // your public collection
        const qy = query(col, orderBy("createdAt", "desc"));
        const snap = await getDocs(qy);

        if (!cancelled) {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setPhotos(data);
          setLoading(false);
          return;
        }
      } catch (_ignore) {
        // continue to API fallback
      }

      // API fallback (your existing function provides or creates sample)
      try {
        const res = await fetch("/api/getOrCreateSamplePhoto");
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        // normalize to [{id,title,url,tags}]
        const normalized = Array.isArray(data) ? data : (data?.items || []);
        setPhotos(normalized);
      } catch (err) {
        setError("Failed to load photos. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = photos;
    if (term) {
      list = list.filter(p =>
        (p.title || "").toLowerCase().includes(term) ||
        (p.tags || []).join(" ").toLowerCase().includes(term)
      );
    }
    if (sort === "popular") {
      list = [...list].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    }
    return list;
  }, [photos, q, sort]);

  return (
    <main className="section">
      <div className="container">
        <h2 className="m-0">Explore</h2>

        <div className="toolbar mt-4">
          <input
            className="input"
            placeholder="Search title or tags..."
            value={q}
            onChange={e => setQ(e.target.value)}
            aria-label="Search photos"
          />
          <select
            className="select"
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="Sort"
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
          </select>
        </div>

        {loading && <p className="muted">Loading…</p>}
        {error && <p style={{color:"#e11d48"}}>{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="muted">No photos found. Try clearing filters.</p>
        )}

        <div className="grid mt-4" role="list">
          {filtered.map(p => (
            <article key={p.id || p.url} className="tile" role="listitem">
              <img src={p.url || p.previewUrl || p.imageUrl} alt={p.title || "Photo"} loading="lazy" />
              <div className="meta">
                <span title={p.title || "Image"}>{p.title || "Untitled"}</span>
                <span className="badge">{(p.tags && p.tags[0]) || "Photo"}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
