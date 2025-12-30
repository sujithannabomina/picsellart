// src/pages/SellerDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PLANS = [
  { id: "starter", name: "Starter", price: 100, maxUploads: 25, maxPrice: 199, durationDays: 180 },
  { id: "pro", name: "Pro", price: 300, maxUploads: 30, maxPrice: 249, durationDays: 180 },
  { id: "elite", name: "Elite", price: 800, maxUploads: 50, maxPrice: 249, durationDays: 180 },
];

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user, role, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || role !== "seller")) {
      navigate("/seller-login", { replace: true });
    }
  }, [loading, user, role, navigate]);

  if (loading) {
    return (
      <main className="page">
        <section style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p>Loading…</p>
        </section>
      </main>
    );
  }

  if (!user) return null;

  const name = user.displayName || "Seller";

  function choosePlan(planId) {
    // ✅ Professional placeholder (no yellow note)
    alert(
      "Plan selection is ready. Razorpay checkout will be connected next with secure server-side verification."
    );
    console.log("Selected plan:", planId);
  }

  return (
    <main className="page">
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderRadius: 26,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(148,163,184,0.25)",
          boxShadow: "0 22px 60px rgba(15,23,42,0.14)",
          padding: 22,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 900 }}>Seller Dashboard</h1>
        <p style={{ marginTop: 8, color: "#4b5563" }}>
          Welcome, <b>{name}</b>. Manage your plan, uploads and pricing limits here.
        </p>

        <div style={{ marginTop: 12, color: "#475569", lineHeight: 1.7 }}>
          <div><b>Email:</b> {user.email || "-"}</div>
          <div><b>UID:</b> {user.uid}</div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button
            type="button"
            onClick={() => navigate("/explore")}
            style={{
              borderRadius: 999,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 800,
              background: "white",
              border: "1px solid #e5e7eb",
              color: "#0f172a",
            }}
          >
            View Marketplace
          </button>

          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate("/", { replace: true });
            }}
            style={{
              borderRadius: 999,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 800,
              background: "white",
              border: "1px solid #e5e7eb",
              color: "#0f172a",
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          <h2 style={{ margin: "10px 0 6px", fontSize: "1.15rem", fontWeight: 900, color: "#0f172a" }}>
            Your Seller Plan
          </h2>
          <p style={{ margin: 0, color: "#64748b" }}>
            Select a plan to start uploading.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
              marginTop: 14,
            }}
          >
            {PLANS.map((p) => (
              <div
                key={p.id}
                style={{
                  borderRadius: 20,
                  border: "1px solid rgba(148,163,184,0.25)",
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 14px 32px rgba(15,23,42,0.10)",
                  padding: 16,
                }}
              >
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 900 }}>{p.name}</h3>
                <div style={{ marginTop: 8, color: "#334155", lineHeight: 1.7 }}>
                  <div><b>Price:</b> ₹{p.price} • <b>Duration:</b> {p.durationDays} days</div>
                  <div><b>Max uploads:</b> {p.maxUploads}</div>
                  <div><b>Max price/image:</b> ₹{p.maxPrice}</div>
                </div>

                <button
                  type="button"
                  onClick={() => choosePlan(p.id)}
                  style={{
                    width: "100%",
                    marginTop: 12,
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontWeight: 900,
                    color: "white",
                    background:
                      p.id === "starter"
                        ? "linear-gradient(90deg, rgba(236,72,153,1) 0%, rgba(139,92,246,1) 100%)"
                        : p.id === "pro"
                        ? "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(236,72,153,1) 100%)"
                        : "linear-gradient(90deg, rgba(15,23,42,1) 0%, rgba(99,102,241,1) 100%)",
                  }}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 12, color: "#64748b" }}>
            Razorpay checkout will be connected with secure verification (server-side) before enabling plan activation.
          </p>
        </div>
      </section>
    </main>
  );
}
