import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { listAll, getDownloadURL, ref } from "firebase/storage";
import { useAuth } from "../context/AuthContext";

function priceFromName(name) {
  // stable pseudo-price based on filename number
  const match = name.match(/\d+/);
  const n = match ? parseInt(match[0], 10) : 1;
  return 120 + (n % 80);
}

async function tryListFolder(paths) {
  for (const p of paths) {
    try {
      const r = ref(storage, p);
      const res = await listAll(r);
      if (res.items?.length) return { path: p, items: res.items };
    } catch (e) {
      // ignore and try next
    }
  }
  return { path: "", items: [] };
}

export default function Explore() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      // Your expected: public/images/sample1.jpg ... sample112.jpg
      const { items: rawItems } = await tryListFolder([
        "public/images",
        "public",
      ]);

      const mapped = await Promise.all(
        rawItems.map(async (it) => {
          const url = await getDownloadURL(it);
          return {
            name: it.name,
            fullPath: it.fullPath,
            url,
            title: "Street Photography",
            price: priceFromName(it.name),
          };
        })
      );

      // Sort: sample1..sample112
      mapped.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      if (alive) {
        setItems(mapped);
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((x) => x.name.toLowerCase().includes(s) || x.title.toLowerCase().includes(s));
  }, [items, q]);

  const onView = (fileName) => navigate(`/photo/${encodeURIComponent(fileName)}`);

  const onBuy = (fileName) => {
    if (!user) {
      navigate(`/buyer-login?redirect=${encodeURIComponent(`/checkout/${fileName}`)}`);
      return;
    }
    navigate(`/checkout/${encodeURIComponent(fileName)}`);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Explore Marketplace</h1>
      <p className="text-gray-600 mt-2">
        Curated images from our public gallery and verified sellers. Login as a buyer to purchase and download watermark-free files.
      </p>

      <div className="mt-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search street, interior, food..."
          className="w-full md:w-[520px] px-4 py-3 rounded-full border bg-white outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>

      {loading ? (
        <div className="mt-10 text-gray-600">Loading images...</div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 text-gray-600">
          No images found. (If this is unexpected, your Firebase Storage folder path may not be `public/images`.)
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((img) => (
            <div key={img.fullPath} className="bg-white rounded-2xl border overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-gray-100">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-900">{img.title}</div>
                <div className="text-sm text-gray-500">{img.name}</div>
                <div className="mt-2 font-bold">₹{img.price}</div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => onView(img.name)}
                    className="flex-1 px-4 py-2 rounded-full border bg-white hover:bg-gray-50 text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onBuy(img.name)}
                    className="flex-1 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    Buy
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">Standard digital license</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
