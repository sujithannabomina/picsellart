import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listPurchases } from "../utils/purchases";
import { RequireBuyer } from "../routes/guards";

function BuyerDashboardInner() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setLoading(true);
      const data = await listPurchases(user.uid);
      setRows(data);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Buyer Dashboard</h1>
          <p className="text-slate-600">Your licensed downloads and receipts.</p>
        </div>
      </header>

      {loading && <div className="card p-6">Loading your purchases…</div>}

      {!loading && rows.length === 0 && (
        <div className="card p-6">
          <div className="font-semibold">No purchases yet</div>
          <div className="text-slate-600">Go to Explore to buy your first image.</div>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left bg-slate-50">
              <tr>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Download</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">{r.filename}</td>
                  <td className="px-4 py-3">₹{r.rupees}</td>
                  <td className="px-4 py-3">{r.rzp_payment_id?.slice(0, 14)}…</td>
                  <td className="px-4 py-3">
                    {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {/* Use storage path set in Explore success handler */}
                    <a
                      href={r.path ? `https://firebasestorage.googleapis.com/v0/b/${import.meta.env.VITE_FIREBASE_BUCKET}/o/${encodeURIComponent(r.path)}?alt=media` : "#"}
                      className="px-3 py-1 rounded-full bg-slate-900 text-white"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function BuyerDashboard() {
  return (
    <RequireBuyer>
      <BuyerDashboardInner />
    </RequireBuyer>
  );
}
