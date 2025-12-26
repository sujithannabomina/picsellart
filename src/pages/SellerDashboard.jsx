import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PLANS = [
  { id: "starter", name: "Starter", price: 100, maxUploads: 25, maxPricePerImage: 199, durationDays: 180 },
  { id: "pro", name: "Pro", price: 300, maxUploads: 30, maxPricePerImage: 249, durationDays: 180 },
  { id: "elite", name: "Elite", price: 800, maxUploads: 50, maxPricePerImage: 249, durationDays: 180 },
];

const PLAN_KEY = "picsellart_seller_plan"; // stored locally for now
const PLAN_EXP_KEY = "picsellart_seller_plan_exp";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(localStorage.getItem(PLAN_KEY) || "");

  const planObj = useMemo(() => PLANS.find((p) => p.id === selectedPlan) || null, [selectedPlan]);

  function activatePlan(planId) {
    const p = PLANS.find((x) => x.id === planId);
    if (!p) return;

    const exp = new Date();
    exp.setDate(exp.getDate() + p.durationDays);

    localStorage.setItem(PLAN_KEY, p.id);
    localStorage.setItem(PLAN_EXP_KEY, exp.toISOString());
    setSelectedPlan(p.id);

    // NOTE: Payment will be connected next. For now, plan activation is UI-only.
  }

  async function onLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <main className="page">
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px 64px" }}>
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
            padding: 18,
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: 0 }}>Seller Dashboard</h1>
          <p style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.65 }}>
            Welcome, <b>{user?.displayName || "Seller"}</b>. Manage your plan, uploads and pricing limits here.
          </p>

          <div style={{ marginTop: 12, color: "#64748b", lineHeight: 1.7 }}>
            <div><b>Email:</b> {user?.email || "-"}</div>
            <div><b>UID:</b> {user?.uid || "-"}</div>
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
              onClick={onLogout}
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

          {/* PLAN SECTION */}
          <div style={{ marginTop: 18 }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, color: "#0f172a" }}>
              Your Seller Plan
            </h2>

            {!planObj ? (
              <p style={{ marginTop: 8, color: "#64748b", lineHeight: 1.7 }}>
                Select a plan to start uploading. (Payment hookup next.)
              </p>
            ) : (
              <div style={{ marginTop: 10, color: "#334155", lineHeight: 1.7 }}>
                Active plan: <b>{planObj.name}</b> • Max uploads: <b>{planObj.maxUploads}</b> • Max price/image:{" "}
                <b>₹{planObj.maxPricePerImage}</b>
              </div>
            )}

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(148,163,184,0.25)",
                    background: "rgba(255,255,255,0.92)",
                    boxShadow: "0 14px 32px rgba(15,23,42,0.10)",
                    padding: 14,
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>{p.name}</div>
                  <div style={{ marginTop: 6, color: "#334155" }}>
                    Price: <b>₹{p.price}</b> • Duration: <b>{p.durationDays} days</b>
                  </div>
                  <div style={{ marginTop: 6, color: "#64748b", lineHeight: 1.7 }}>
                    Max uploads: <b>{p.maxUploads}</b>
                    <br />
                    Max price/image: <b>₹{p.maxPricePerImage}</b>
                  </div>

                  <button
                    type="button"
                    onClick={() => activatePlan(p.id)}
                    style={{
                      marginTop: 10,
                      border: "none",
                      borderRadius: 999,
                      padding: "10px 14px",
                      cursor: "pointer",
                      fontWeight: 900,
                      color: "white",
                      width: "100%",
                      background:
                        p.id === "elite"
                          ? "linear-gradient(135deg, #111827, #4f46e5)"
                          : p.id === "pro"
                          ? "linear-gradient(135deg, #8b5cf6, #4f46e5)"
                          : "linear-gradient(135deg, #ec4899, #8b5cf6)",
                    }}
                  >
                    {selectedPlan === p.id ? "Selected" : "Choose Plan"}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, color: "#64748b", lineHeight: 1.7 }}>
              Next step: connect Razorpay payment so plan activation becomes real + secure (server-side verification).
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
