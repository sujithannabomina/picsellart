// src/pages/SellerDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addDoc, collection, doc, getDoc, runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "./_utils_date"; // tiny formatter below in this file

export default function SellerDashboard() {
  const { user, loading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Upload form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      const uref = doc(db, "users", user.uid);
      const snap = await getDoc(uref);
      setProfile(snap.exists() ? snap.data() : null);
    })();
  }, [user, loading, refreshKey]);

  const caps = useMemo(() => ({
    maxUploads: profile?.maxUploads ?? 0,
    used: profile?.uploadsUsed ?? 0,
    maxPrice: profile?.maxPricePerImage ?? 0,
    expired: profile?.expiresAt?.toDate ? profile.expiresAt.toDate() < new Date() : true,
  }), [profile]);

  const canUpload = user && profile && !caps.expired && caps.used < caps.maxUploads;

  async function handleUpload(e) {
    e.preventDefault();
    if (!canUpload) return;
    if (!file) return alert("Choose an image file");
    const priceNum = Number(price);
    if (!priceNum || priceNum <= 0) return alert("Enter a valid price");
    if (caps.maxPrice && priceNum > caps.maxPrice) return alert(`Max price per image is ₹${caps.maxPrice}`);

    setBusy(true);
    try {
      const filename = `${Date.now()}_${file.name}`.replace(/\s+/g, "_");
      const sref = ref(storage, `sellers/${user.uid}/${filename}`);
      await uploadBytes(sref, file);
      const publicUrl = await getDownloadURL(sref);

      // Create photo + increment uploadsUsed atomically
      await runTransaction(db, async (tx) => {
        const uref = doc(db, "users", user.uid);
        const usnap = await tx.get(uref);
        if (!usnap.exists()) throw new Error("User profile missing");
        const u = usnap.data();

        const now = new Date();
        if (u.expiresAt?.toDate && u.expiresAt.toDate() < now) {
          throw new Error("Plan expired");
        }
        if ((u.uploadsUsed ?? 0) >= (u.maxUploads ?? 0)) {
          throw new Error("Upload limit reached");
        }
        if (u.maxPricePerImage && priceNum > u.maxPricePerImage) {
          throw new Error("Price exceeds plan cap");
        }

        const photosRef = collection(db, "photos");
        const docRef = await tx.set(doc(photosRef), {
          sellerId: user.uid,
          title: title || "Untitled",
          tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
          price: priceNum,
          currency: "INR",
          storagePath: `sellers/${user.uid}/${filename}`,
          publicUrl,                   // watermarked URL can be swapped later
          watermarkUrl: publicUrl,     // placeholder; you can replace with wm path later
          isPublic: true,              // listed on Explore
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: false });

        tx.update(uref, {
          uploadsUsed: (u.uploadsUsed ?? 0) + 1,
          updatedAt: serverTimestamp(),
        });
      });

      // Reset form + refresh profile
      setTitle(""); setPrice(""); setTags(""); setFile(null);
      setRefreshKey(x => x + 1);
      alert("Uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section container">
      <div className="flex items-center justify-between mb-6">
        <h1>Seller Dashboard</h1>
        <button className="btn" onClick={logout}>Logout</button>
      </div>

      {!user && !loading && <p>Please sign in.</p>}
      {loading && <p>Loading...</p>}

      {user && profile && (
        <>
          <div className="grid">
            <div className="rounded-2xl border border-[#e2e8f0] p-5 bg-white">
              <h3 className="text-lg font-medium text-slate-900">Plan</h3>
              <div className="mt-2 text-sm text-slate-700">Current pack: <b>{profile.planId?.toUpperCase() || "—"}</b></div>
              <div className="mt-1 text-sm text-slate-700">Uploads: {caps.used} / {caps.maxUploads}</div>
              <div className="mt-1 text-sm text-slate-700">Max price per image: ₹{caps.maxPrice || 0}</div>
              <div className="mt-1 text-sm text-slate-700">Expires on: {format(profile.expiresAt)}</div>
              {caps.expired && (
                <div className="mt-2 text-sm text-red-600">Access expired — please go to “Pay” and activate a pack.</div>
              )}
            </div>

            <div className="rounded-2xl border border-[#e2e8f0] p-5 bg-white">
              <h3 className="text-lg font-medium text-slate-900">Upload new image</h3>
              <form className="mt-3 space-y-3" onSubmit={handleUpload}>
                <input
                  className="input w-full"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className="input w-full"
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <input
                  className="input w-full"
                  type="number"
                  placeholder={`Price (max ₹${caps.maxPrice || 0})`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={1}
                  max={caps.maxPrice || undefined}
                />
                <input
                  className="input w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button className="btn btn-primary" type="submit" disabled={!canUpload || busy}>
                  {!canUpload ? "Upload not available" : busy ? "Uploading..." : "Upload"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

/* -------- tiny date formatter (no external deps) -------- */
function pad(n){ return n < 10 ? `0${n}` : `${n}`; }
export function format(ts) {
  if (!ts) return "—";
  try {
    const d = ts.toDate ? ts.toDate() : ts;
    if (!(d instanceof Date) || isNaN(d.getTime())) return "—";
    return `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
  } catch { return "—"; }
}
