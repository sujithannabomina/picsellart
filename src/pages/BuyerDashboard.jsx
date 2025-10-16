// src/pages/BuyerDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function BuyerDashboard() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    const run = async () => {
      setBusy(true);
      try {
        const qRef = query(
          collection(db, "orders"),
          where("buyerId", "==", user.uid),
          where("status", "==", "paid"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(qRef);
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
        setOrders([]);
      } finally {
        setBusy(false);
      }
    };
    run();
  }, [loading, user]);

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Buyer Dashboard</h1>
        {loading || busy ? (
          <p>Loading…</p>
        ) : orders.length === 0 ? (
          <p>No purchases yet.</p>
        ) : (
          <div className="grid">
            {orders.map((o) => (
              <article key={o.id} className="photo-card" style={{ padding: 16 }}>
                <div className="meta">
                  <div className="title">{o.title || "Licensed Image"}</div>
                  <div className="price">₹{o.amount}</div>
                </div>
                <a
                  className="btn ghost w-full"
                  href={o.downloadUrl}
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
