// src/pages/BuyerDashboard.jsx
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const q = query(
          collection(db, "purchases"),
          where("buyerUid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        if (!cancel) {
          setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (!cancel) setLoading(false);
      }
    })();
    return () => (cancel = true);
  }, [user.uid]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Buyer Dashboard</h1>
        {loading ? (
          <p>Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-slate-600">No purchases yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rows.map((p) => (
              <div key={p.id} className="border rounded-xl overflow-hidden bg-white">
                <img src={p.url} alt={p.name} className="w-full aspect-[4/3] object-cover" />
                <div className="p-3">
                  <div className="text-sm text-slate-500">{p.title}</div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm mt-1">Paid: ₹{p.amount}</div>
                  <a
                    href={p.url}
                    className="mt-2 inline-flex px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
