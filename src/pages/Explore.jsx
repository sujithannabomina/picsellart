import React, { useEffect, useMemo, useState } from "react";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { useAuth } from "../context/AuthContext";

function priceFromName(name) {
  // Stable demo pricing: 151 - 199
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return 151 + (hash % 49);
}

export default function Explore() {
  const nav = useNavigate();
  const { user, roles } = useAuth();

  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]); // {name, url}
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const folderRef = ref(storage, "public/images");
        const res = await listAll(folderRef);

        const urls = await Promise.all(
          res.items.map(async (item) => ({
            name: item.name,
            url: await getDownloadURL(item),
          }))
        );

        // Sort sample1..sample112 correctly
        urls.sort((a, b) => {
          const an = parseInt(a.name.replace(/\D/g, ""), 10);
          const bn = parseInt(b.name.replace(/\D/g, ""), 10);
          return (an || 0) - (bn || 0);
        });

        if (alive) setFiles(urls);
      } catch (e) {
        console.error(e);
        if (alive) setFiles([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return files;
    return files.filter((f) => f.name.toLowerCase().includes(s));
  }, [files, q]);

  const onView = (fileName) => {
    nav(`/photo/${encodeURIComponent(fileName)}`);
  };

  const onBuy = (fileName) => {
    // If not logged-in buyer → login first and come back
    if (!user || !roles.buyer) {
      nav(`/buyer-login?next=${encodeURIComponent(`/checkout/${encodeURIComponent(fileName)}`)}`);
      return;
    }
    nav(`/checkout/${encodeURIComponent(fileName)}`);
  };

  return (
    <div>
      <h1 className="text-4xl font-semibold">Explore Marketplace</h1>
      <p className="mt-2 text-black/70">
        Curated images from our public gallery and verified sellers. Login as a buyer to purchase and download watermark-free files.
      </p>

      <div className="mt-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by filename… (sample1.jpg)"
          className="w-full max-w-xl px-4 py-3 rounded-full border border-black/10 bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {loading ? (
        <p className="mt-8 text-black/60">Loading images…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-black/60">No images found.</p>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((f) => {
            const price = priceFromName(f.name);
            return (
              <div key={f.name} className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
                <div className="aspect-[4/3] bg-black/5">
                  <img src={f.url} alt={f.name} className="h-full w-full object-cover" />
                </div>

                <div className="p-4">
                  <div className="font-semibold">Street Photography</div>
                  <div className="text-sm text-black/60">{f.name}</div>

                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="font-semibold">₹{price}</div>
                      <div className="text-xs text-black/50">Standard digital license</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onView(f.name)}
                        className="px-4 py-2 rounded-full border border-black/10 text-sm hover:bg-black/5"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => onBuy(f.name)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm shadow hover:opacity-95"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
