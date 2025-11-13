import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchAllExploreImages } from "../utils/storage";
import { priceForName, priceToPaise } from "../utils/exploreData";
import { openRazorpay } from "../utils/loadRazorpay";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Explore() {
  const { user, role, ensureBuyer } = useAuth();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const imgs = await fetchAllExploreImages(); // public/ + Buyer/
      setItems(imgs);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    const s = q.toLowerCase();
    return items.filter((x) => x.name.toLowerCase().includes(s));
  }, [q, items]);

  async function handleBuy(img) {
    // must be a logged-in buyer
    await ensureBuyer();

    const rupees = priceForName(img.name); // e.g., 399
    const amountPaise = priceToPaise(rupees); // 39900

    const meta = { filename: img.name, path: img.path, rupees };

    await openRazorpay({
      amount: amountPaise,
      description: `Picsellart • ${img.name}`,
      notes: meta,
      onSuccess: async (rzp) => {
        // record purchase for buyer
        if (user) {
          await addDoc(collection(db, "purchases"), {
            uid: user.uid,
            filename: img.name,
            path: img.path,
            rupees,
            rzp_payment_id: rzp.razorpay_payment_id,
            createdAt: serverTimestamp(),
          });
        }
        // direct download
        const a = document.createElement("a");
        a.href = img.urlOriginal; // original file (no watermark)
        a.download = img.name;
        a.rel = "noopener";
        a.click();
      },
    });
  }

  return (
    <section>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
        Street Photography
      </h2>
      <p className="text-slate-600 mb-5">
        Curated images from our public gallery and verified sellers. Login as a
        buyer to purchase and download.
      </p>

      <div className="flex gap-2 items-center mb-6">
        <input
          placeholder="Search by name..."
          className="px-4 py-2 rounded-full bg-white ring-1 ring-slate-300 flex-1"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="px-3 py-2 rounded-lg bg-slate-200" onClick={() => setQ("")}>
          Clear
        </button>
      </div>

      {loading && <p>Loading images…</p>}

      {!loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((img) => {
            const rupees = priceForName(img.name);
            return (
              <div key={img.url} className="rounded-xl overflow-hidden bg-white ring-1 ring-slate-200 shadow">
                <div className="relative">
                  {/* Watermarked preview */}
                  <img
                    src={img.urlWatermarked}
                    alt={img.name}
                    className="w-full h-[280px] object-cover"
                    loading="lazy"
                  />
                  <span className="absolute inset-x-0 top-3 mx-auto text-xs tracking-wide px-2 py-1 rounded bg-black/35 text-white">
                    PICSELLART
                  </span>
                </div>

                <div className="px-4 py-3">
                  <div className="text-sm text-slate-700">Street Photography</div>
                  <div className="text-xs text-slate-500">{img.name}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="font-semibold text-indigo-700">₹{rupees}</div>
                    <button
                      className="text-sm px-3 py-1.5 rounded-full bg-slate-900 text-white"
                      onClick={() => handleBuy(img)}
                    >
                      Buy & Download
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
