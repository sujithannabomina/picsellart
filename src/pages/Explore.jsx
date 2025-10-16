import { useEffect, useMemo, useState } from "react";
import { storage, db } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

/** Stable price in ₹149–₹249 derived from filename (so it doesn't jump) */
function priceFromName(name) {
  // Simple hash
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const min = 149;
  const max = 249;
  return min + (h % (max - min + 1));
}

export default function Explore() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [samples, setSamples] = useState([]);
  const [userPhotos, setUserPhotos] = useState([]);
  const [qText, setQText] = useState("");

  // 1) Load SAMPLE IMAGES directly from Firebase Storage: public/*
  useEffect(() => {
    const run = async () => {
      try {
        const baseRef = ref(storage, "public");
        const ls = await listAll(baseRef); // lists all items under /public
        const items = await Promise.all(
          ls.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const name = itemRef.name || "sample";
            return {
              id: `sample::${name}`, // deterministic id
              title: "Street Photography",
              tags: ["street", "sample"],
              price: priceFromName(name),
              // Storage samples are not watermarked; we display as-is
              watermarkedUrl: url,
              originalUrl: url,
              isPublished: true,
              isSample: true,
              storagePath: `public/${name}`,
              createdAt: new Date(0), // keep samples sorted after user content
              ownerUid: "admin",
            };
          })
        );

        // Keep a nice order by filename (sample1, sample2, …)
        items.sort((a, b) => a.id.localeCompare(b.id));
        setSamples(items);
      } catch (e) {
        console.error("Storage/public load failed:", e);
        setSamples([]);
      }
    };
    run();
  }, []);

  // 2) Load USER UPLOADS from Firestore: photos (isPublished==true)
  useEffect(() => {
    const run = async () => {
      try {
        const refCol = collection(db, "photos");
        const snap = await getDocs(
          query(
            refCol,
            where("isPublished", "==", true),
            orderBy("createdAt", "desc"),
            limit(120)
          )
        );
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUserPhotos(rows);
      } catch (e) {
        console.error("Firestore photos load failed:", e);
        setUserPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const allItems = useMemo(
    () => [...userPhotos, ...samples], // show user content first (newest)
    [userPhotos, samples]
  );

  const filtered = useMemo(() => {
    const needle = qText.trim().toLowerCase();
    if (!needle) return allItems;
    return allItems.filter((p) => {
      const t = (p.title || "").toLowerCase();
      const tags = (p.tags || []).join(" ").toLowerCase();
      return t.includes(needle) || tags.includes(needle);
    });
  }, [qText, allItems]);

  /** Ensure there's a Firestore doc for a sample so the normal purchase flow works. */
  const ensureSampleDoc = async (sample) => {
    const res = await fetch("/api/getOrCreateSamplePhoto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: sample.id, // "sample::filename.jpg"
        title: sample.title,
        price: sample.price,
        originalUrl: sample.originalUrl,
        watermarkedUrl: sample.watermarkedUrl,
        storagePath: sample.storagePath,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to prepare sample");
    return data.photoId; // returns the Firestore doc id
  };

  const createOrder = async (photoId, title, price) => {
    const res = await fetch("/api/createPhotoOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Order error");

    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: data.orderId,
      amount: data.amount,
      currency: "INR",
      name: "Picsellart",
      description: title || "Photo",
      handler: async (response) => {
        await fetch("/api/verifyPhotoPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoId, ...response }),
        });
        window.location.href = "/buyer/dashboard";
      },
      prefill: user
        ? { email: user.email || "", name: user.displayName || "" }
        : {},
    });
    rzp.open();
  };

  const startBuy = async (item) => {
    try {
      // If the user is not logged in, send to buyer login first
      if (!user) {
        window.location.href = "/buyer/login";
        return;
      }

      if (item.isSample) {
        // Create/ensure a doc for the Storage sample, then use normal createPhotoOrder
        const photoId = await ensureSampleDoc(item);
        await createOrder(photoId, item.title, item.price);
      } else {
        await createOrder(item.id, item.title, item.price);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Explore Pictures
        </h1>
        <input
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          placeholder="Search by title or tag..."
          className="w-80 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-indigo-300"
        />
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-gray-500">No results.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm"
          >
            <img
              src={p.watermarkedUrl || p.originalUrl}
              alt={p.title || "Photo"}
              className="h-60 w-full object-cover"
              loading="lazy"
            />
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {p.title || "Untitled"}
                </div>
                <div className="text-xs text-gray-500">₹{p.price}</div>
              </div>
              <button
                onClick={() => startBuy(p)}
                className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
