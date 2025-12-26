import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setErr("");

        if (!user?.uid) return;

        const qy = query(
          collection(db, "purchases"),
          where("buyerUid", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(qy);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        if (alive) setPurchases(items);
      } catch (e) {
        console.error(e);
        if (alive) setErr("Could not load purchases yet.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [user]);

  const name = profile?.name || user?.displayName || "Buyer";
  const email = profile?.email || user?.email || "";

  const pageStyle = { maxWidth: 1120, margin: "0 auto", padding: "28px 16px 64px" };
  const card = {
    borderRadius: 22,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
    padding: 18,
    maxWidth: 980,
    marginTop: 14,
  };

  const btnPrimary = {
    border: "none",
    borderRadius: 999,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 800,
    color: "white",
    background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
    boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)",
  };

  const btnGhost = {
    borderRadius: 999,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 800,
    background: "white",
    border: "1px solid #e5e7eb",
    color: "#0f172a",
  };

  const purchaseRows = useMemo(() => purchases || [], [purchases]);

  return (
    <main className="page">
      <section style={pageStyle}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Buyer Dashboard</h1>
        <p style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.65, maxWidth: 860 }}>
          Welcome, <b>{name}</b>. This dashboard is where your purchases and downloads will appear.
        </p>

        <div style={card}>
          <div style={{ color: "#334155", lineHeight: 1.7 }}>
            <div><b>Email:</b> {email}</div>
            <div><b>UID:</b> {user?.uid}</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button type="button" style={btnPrimary} onClick={() => navigate("/explore")}>
              Explore Pictures
            </button>
            <button type="button" style={btnGhost} onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ ...card, marginTop: 14 }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 900, color: "#0f172a" }}>
            My Purchases
          </h2>
          <p style={{ marginTop: 8, color: "#64748b", lineHeight: 1.6 }}>
            After payment integration, purchases will show here with download buttons.
          </p>

          {loading && <p style={{ marginTop: 12 }}>Loading…</p>}
          {err && <p style={{ marginTop: 12, color: "#b91c1c", fontWeight: 700 }}>{err}</p>}

          {!loading && !err && purchaseRows.length === 0 && (
            <div
              style={{
                marginTop: 12,
                borderRadius: 18,
                border: "1px solid rgba(148,163,184,0.25)",
                background: "rgba(239,246,255,0.55)",
                padding: 14,
                color: "#0f172a",
              }}
            >
              No purchases yet. Go to Explore and buy your first image.
            </div>
          )}

          {!loading && !err && purchaseRows.length > 0 && (
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {purchaseRows.map((p) => (
                <div
                  key={p.id}
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(148,163,184,0.25)",
                    background: "rgba(255,255,255,0.85)",
                    padding: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 900, color: "#0f172a" }}>
                      {p.filename || "Purchased Image"}
                    </div>
                    <div style={{ color: "#64748b" }}>
                      ₹{p.price || "-"} • {p.createdAt?.toDate?.()?.toLocaleString?.() || "—"}
                    </div>
                  </div>

                  <button
                    type="button"
                    style={btnGhost}
                    onClick={() => alert("Download will be enabled after payment integration.")}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
