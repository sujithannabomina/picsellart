// src/pages/SellerLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PLANS = [
  { id: "starter", name: "Starter", price: 100, maxUploads: 25, maxPrice: 199, durationDays: 180 },
  { id: "pro", name: "Pro", price: 300, maxUploads: 30, maxPrice: 249, durationDays: 180 },
  { id: "elite", name: "Elite", price: 800, maxUploads: 50, maxPrice: 249, durationDays: 180 },
];

export default function SellerLogin() {
  const navigate = useNavigate();
  const { loginAsSeller, sellerPlan, setSellerPlan } = useAuth();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const selected = PLANS.find((p) => p.id === sellerPlan) || PLANS[0];

  const onLogin = async () => {
    try {
      setErr("");
      setBusy(true);
      await loginAsSeller(selected.id);
      navigate("/seller/dashboard", { replace: true });
    } catch (e) {
      console.error(e);
      setErr("Seller login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page" style={{ display: "grid", placeItems: "center" }}>
      <section style={{ width: "100%", maxWidth: 720 }}>
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
            padding: 18,
          }}
        >
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, margin: 0 }}>Seller Login</h1>
          <p style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.7 }}>
            Choose your plan and sign in. Upload limits and price caps are enforced inside Seller Dashboard.
          </p>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {PLANS.map((p) => {
              const active = p.id === selected.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSellerPlan(p.id)}
                  style={{
                    textAlign: "left",
                    borderRadius: 18,
                    padding: 14,
                    cursor: "pointer",
                    border: active ? "2px solid #7c3aed" : "1px solid rgba(148,163,184,0.25)",
                    background: active ? "rgba(237,233,254,0.7)" : "rgba(255,255,255,0.9)",
                    boxShadow: "0 14px 32px rgba(15,23,42,0.08)",
                  }}
                >
                  <div style={{ fontWeight: 900, color: "#0f172a" }}>{p.name}</div>
                  <div style={{ marginTop: 6, color: "#334155", lineHeight: 1.6, fontSize: "0.92rem" }}>
                    ₹{p.price} • {p.maxUploads} uploads • Max ₹{p.maxPrice}/image • {p.durationDays} days
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onLogin}
            disabled={busy}
            style={{
              marginTop: 14,
              width: "100%",
              border: "none",
              borderRadius: 999,
              padding: "12px 16px",
              cursor: busy ? "not-allowed" : "pointer",
              fontWeight: 800,
              color: "white",
              background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
              boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)",
              opacity: busy ? 0.75 : 1,
            }}
          >
            {busy ? "Signing in…" : "Continue with Google"}
          </button>

          {err && (
            <div
              style={{
                marginTop: 12,
                borderRadius: 14,
                padding: 12,
                border: "1px solid rgba(248,113,113,0.35)",
                background: "rgba(254,226,226,0.65)",
                color: "#7f1d1d",
              }}
            >
              {err}
            </div>
          )}

          <div style={{ marginTop: 12, color: "#64748b", fontSize: "0.92rem", lineHeight: 1.6 }}>
            Razorpay plan payment can be connected later. Right now this sets plan rules for upload + pricing.
          </div>
        </div>
      </section>
    </main>
  );
}
