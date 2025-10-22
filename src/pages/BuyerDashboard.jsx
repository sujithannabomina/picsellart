// src/pages/BuyerDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function BuyerDashboard() {
  const { user, loading, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      setBusy(true);
      try {
        const ref = collection(db, "users", user.uid, "purchases");
        const snap = await getDocs(ref);
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } finally {
        setBusy(false);
      }
    })();
  }, [user, loading]);

  return (
    <main className="section container">
      <div className="flex items-center justify-between mb-6">
        <h1>Buyer Dashboard</h1>
        <button className="btn" onClick={logout}>Logout</button>
      </div>

      {!user && !loading && <p>Please sign in.</p>}
      {loading && <p>Loading...</p>}

      {user && !loading && (
        <>
          {busy && <p>Loading purchases…</p>}

          {items.length === 0 && !busy && (
            <div className="rounded-2xl border border-[#e2e8f0] p-5 bg-white">
              <h3 className="text-lg font-medium text-slate-900">No purchases yet</h3>
              <p className="text-slate-600 mt-1">Explore photos and buy your first image.</p>
            </div>
          )}

          <div className="grid">
            {items.map((p) => (
              <article key={p.id} className="rounded-2xl border border-[#e2e8f0] p-5 bg-white">
                <div className="flex items-center gap-3">
                  {p.previewUrl ? (
                    <img
                      src={p.previewUrl}
                      alt={p.title || "Purchased photo"}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-md bg-[#f1f5f9]" />
                  )}
                  <div>
                    <div className="text-slate-900 text-sm">{p.title || "Untitled"}</div>
                    <div className="text-slate-600 text-xs">₹{p.amount || "—"} • {p.currency || "INR"}</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  {p.downloadUrl ? (
                    <a className="btn btn-primary" href={p.downloadUrl} target="_blank" rel="noreferrer">
                      Download HD
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">Download link not available</span>
                  )}
                  {p.licenseUrl && (
                    <a className="btn" href={p.licenseUrl} target="_blank" rel="noreferrer">
                      License
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
