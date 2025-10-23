// src/pages/BuyerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase.js";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";

export default function BuyerDashboard() {
  const { user } = useAuth?.() || { user: null };
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Orders that webhook marked as paid for this user
        const q = query(
          collection(db, "orders"),
          where("buyerId", "==", user.uid || user.id),
          where("status", "==", "paid"),
          orderBy("paidAt", "desc"),
          limit(50)
        );
        const snap = await getDocs(q);
        const rows = [];
        snap.forEach(d => rows.push({ id: d.id, ...d.data() }));
        setItems(rows);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user]);

  return (
    <main className="section container">
      <h1>Buyer Dashboard</h1>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Your purchases</h3>
        {items.length === 0 ? (
          <div className="muted">No purchases yet.</div>
        ) : (
          <ul className="muted">
            {items.map(x => (
              <li key={x.id} style={{ marginBottom: 8 }}>
                {x.photo?.title || "Photo"} — ₹{Number(x.amount || 0)/100}
                {x.downloadUrl ? (
                  <>
                    {" "}- <a href={x.downloadUrl} target="_blank" rel="noreferrer">Download</a>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
