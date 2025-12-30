// src/pages/SellerDashboard.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

const PLANS = [
  { id: "starter", name: "Starter", price: 100, maxUploads: 25, maxPrice: 199, durationDays: 180 },
  { id: "pro", name: "Pro", price: 300, maxUploads: 30, maxPrice: 249, durationDays: 180 },
  { id: "elite", name: "Elite", price: 800, maxUploads: 50, maxPrice: 249, durationDays: 180 },
];

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const uid = user?.uid;

  const selectPlan = async (planId) => {
    if (!uid) return;
    setSaving(true);

    try {
      const plan = PLANS.find((p) => p.id === planId);
      const sellerRef = doc(db, "sellers", uid);
      const snap = await getDoc(sellerRef);

      // Keep existing plan if already chosen (avoid accidental overwrite)
      if (snap.exists() && snap.data()?.planId) {
        navigate("/seller/upload");
        return;
      }

      const now = Date.now();
      const expiresAtMs = now + plan.durationDays * 24 * 60 * 60 * 1000;

      await setDoc(
        sellerRef,
        {
          uid,
          email: user?.email || "",
          name: user?.displayName || "",
          planId: plan.id,
          planName: plan.name,
          planPrice: plan.price,
          maxUploads: plan.maxUploads,
          maxPrice: plan.maxPrice,
          durationDays: plan.durationDays,
          activatedAt: serverTimestamp(),
          expiresAtMs,
          // paymentStatus will be wired later with Razorpay + webhook
          paymentStatus: "pending",
        },
        { merge: true }
      );

      navigate("/seller/upload");
    } finally {
      setSaving(false);
    }
  };

  const cards = useMemo(() => PLANS, []);

  return (
    <div className="page">
      <div className="card">
        <h1>Seller Dashboard</h1>
        <p style={{ color: "#4b5563" }}>
          Welcome, <b>{user?.displayName || "Seller"}</b>. Manage your plan, uploads and pricing limits here.
        </p>

        <div style={{ marginTop: 10, color: "#6b7280" }}>
          <div>
            <b style={{ color: "#374151" }}>Email:</b> {user?.email}
          </div>
          <div>
            <b style={{ color: "#374151" }}>UID:</b> {user?.uid}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <button className="btn btn-nav" onClick={() => navigate("/explore")}>
            View Marketplace
          </button>
          <button className="btn btn-nav" onClick={logout}>
            Logout
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          <h3 style={{ marginBottom: 6 }}>Your Seller Plan</h3>
          <p style={{ color: "#6b7280", marginTop: 0 }}>
            Choose a plan to start uploading. (Razorpay activation will be connected via webhook next.)
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {cards.map((p) => (
              <div key={p.id} className="image-card">
                <div className="image-card-body">
                  <div className="image-card-title" style={{ fontSize: "1.05rem" }}>{p.name}</div>
                  <div style={{ marginTop: 6, color: "#4b5563" }}>
                    Price: <b>₹{p.price}</b> • Duration: <b>{p.durationDays} days</b>
                  </div>
                  <div style={{ marginTop: 8, color: "#4b5563" }}>
                    Max uploads: <b>{p.maxUploads}</b>
                  </div>
                  <div style={{ marginTop: 6, color: "#4b5563" }}>
                    Max price/image: <b>₹{p.maxPrice}</b>
                  </div>

                  <button
                    className="btn btn-nav-primary"
                    disabled={saving}
                    onClick={() => selectPlan(p.id)}
                    style={{ marginTop: 12, width: "100%" }}
                  >
                    {saving ? "Please wait..." : "Choose Plan"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 12, color: "#6b7280" }}>
            Next step: connect Razorpay payment so plan activation becomes real + secure (server-side verification).
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
