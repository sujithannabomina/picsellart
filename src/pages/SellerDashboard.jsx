// src/pages/SellerDashboard.jsx
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { DEFAULT_SELLER_LIMITS } from "../utils/plans";
import { priceForName } from "../utils/exploreData";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState("");

  const MAX_PRICE = DEFAULT_SELLER_LIMITS.maxPrice; // could read plan from Firestore later

  const rootRef = ref(storage, `sellers/${user.uid}/images`);

  const refresh = async () => {
    const res = await listAll(rootRef);
    const rows = await Promise.all(
      res.items.map(async (it) => ({
        name: it.name,
        path: it.fullPath,
        url: await getDownloadURL(it),
      }))
    );
    setItems(rows.sort((a, b) => a.name.localeCompare(b.name)));
  };

  useEffect(() => {
    refresh().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid]);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const cleanName = file.name.replace(/\s+/g, "_");
    const p = Number(price || priceForName(cleanName));
    if (Number.isNaN(p) || p < 1 || p > MAX_PRICE) {
      alert(`Enter a valid price (1–${MAX_PRICE}).`);
      return;
    }

    setBusy(true);
    try {
      const destRef = ref(storage, `sellers/${user.uid}/images/${cleanName}`);
      const task = uploadBytesResumable(destRef, file);
      await new Promise((resolve, reject) => {
        task.on("state_changed", null, reject, resolve);
      });
      const url = await getDownloadURL(destRef);

      // Optional: record metadata for search/analytics
      await addDoc(collection(db, "seller_images"), {
        ownerUid: user.uid,
        name: cleanName,
        url,
        storagePath: destRef.fullPath,
        price: p,
        title: "Street Photography",
        createdAt: serverTimestamp(),
      });

      setFile(null);
      setPrice("");
      await refresh();
      alert("Upload complete.");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (path) => {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteObject(ref(storage, path));
      await refresh();
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Seller Dashboard</h1>

        <form onSubmit={onUpload} className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end max-w-3xl">
          <div>
            <label className="text-sm text-slate-600">Select Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Price (₹, ≤ {MAX_PRICE})</label>
            <input
              type="number"
              min="1"
              max={MAX_PRICE}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 199"
              className="block w-32 border rounded-md px-3 py-2"
            />
          </div>
          <button
            disabled={busy || !file}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Upload"}
          </button>
        </form>

        <h2 className="mt-8 text-xl font-semibold">Your Images</h2>
        {items.length === 0 ? (
          <p className="text-slate-600 mt-2">No images uploaded yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it) => (
              <div key={it.path} className="border rounded-xl overflow-hidden bg-white">
                <img src={it.url} alt={it.name} className="w-full aspect-[4/3] object-cover" />
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Street Photography</div>
                    <div className="font-semibold">{it.name}</div>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-md border"
                    onClick={() => onDelete(it.path)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-sm text-slate-500">
          Explore auto-updates from your uploads. Files appear under <code>sellers/{user.uid}/images/</code>.
        </p>
      </main>
    </>
  );
}
