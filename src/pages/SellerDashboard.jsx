import { useEffect, useState } from "react";
import { RequireSeller } from "../routes/guards";
import { useAuth } from "../context/AuthContext";
import { getActivePlan, uploadSellerFile, validateUpload } from "../utils/seller";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function SellerDashboardInner() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState([]);

  async function refreshPlan() {
    if (!user) return;
    const p = await getActivePlan(user.uid);
    setPlan(p);
  }

  async function refreshUploads() {
    if (!user) return;
    const qy = query(
      collection(db, "seller_uploads"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(qy);
    setUploads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    refreshPlan();
    refreshUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!user || !file) return;
    try {
      setBusy(true);
      validateUpload(plan, price);
      await uploadSellerFile({ uid: user.uid, file, price: Number(price) });
      setFile(null);
      setPrice("");
      await Promise.all([refreshPlan(), refreshUploads()]);
    } catch (err) {
      alert(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Seller Dashboard</h1>
          <p className="text-slate-600">Manage uploads and view your inventory.</p>
        </div>
        <div className="card px-5 py-3">
          <div className="text-sm">Plan: <b>{plan?.planId || "—"}</b></div>
          <div className="text-sm">Uploads left: <b>{plan?.uploads ?? "—"}</b></div>
          <div className="text-sm">Max price: <b>₹{plan?.maxPrice ?? "—"}</b></div>
        </div>
      </header>

      <form onSubmit={handleUpload} className="card p-5 grid gap-3 md:grid-cols-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Select image</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full
                       file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />
          <p className="text-xs text-slate-500 mt-1">Uploaded files appear in Explore (public gallery).</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            min="1"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-lg ring-1 ring-slate-300"
          />
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={busy}
            className="px-5 py-2.5 rounded-full bg-indigo-600 text-white font-semibold disabled:opacity-60"
          >
            {busy ? "Uploading…" : "Upload to Gallery"}
          </button>
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left bg-slate-50">
            <tr>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Path</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((u) => (
              <tr key={u.id} className="border-t align-middle">
                <td className="px-4 py-3">
                  <img src={u.url} alt="" className="w-14 h-14 object-cover rounded-md" />
                </td>
                <td className="px-4 py-3">{u.filename}</td>
                <td className="px-4 py-3">₹{u.price}</td>
                <td className="px-4 py-3 text-xs">{u.path}</td>
                <td className="px-4 py-3">
                  {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {uploads.length === 0 && (
              <tr><td className="px-4 py-5" colSpan={5}>No uploads yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  return (
    <RequireSeller>
      <SellerDashboardInner />
    </RequireSeller>
  );
}
