// src/pages/SellerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PLANS } from "../utils/plans";
import {
  getSellerProfile,
  hasActivePlan,
  upsertSellerPlan,
} from "../utils/seller";
import { openCheckout } from "../utils/razorpay";

function SellerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoadingProfile(true);
      const data = await getSellerProfile(user.uid);
      setProfile(data);
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [user]);

  const refreshProfile = async () => {
    if (!user) return;
    const data = await getSellerProfile(user.uid);
    setProfile(data);
  };

  const handleChoosePlan = async (plan) => {
    if (!user) return;
    setProcessingPlanId(plan.id);
    try {
      await openCheckout({
        amount: plan.price * 100, // Razorpay expects paise
        currency: "INR",
        description: `${plan.name} seller plan`,
        metadata: {
          type: "seller_plan",
          planId: plan.id,
          uid: user.uid,
          email: user.email,
        },
        buyerDetails: {
          name: user.displayName || "",
          email: user.email || "",
        },
        onSuccess: async () => {
          // After verified payment, mark plan as active
          await upsertSellerPlan(user.uid, plan);
          await refreshProfile();
        },
      });
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 720, margin: "3rem auto", padding: "0 1.5rem" }}>
        <h1>Seller Dashboard</h1>
        <p>You must log in as a seller to access this page.</p>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div style={{ maxWidth: 720, margin: "3rem auto", padding: "0 1.5rem" }}>
        <h1>Seller Dashboard</h1>
        <p>Loading your seller account...</p>
      </div>
    );
  }

  const active = hasActivePlan(profile);

  if (!active) {
    // ❌ No active plan – force them to choose and pay before seeing uploads etc.
    return (
      <div style={{ maxWidth: 960, margin: "3rem auto", padding: "0 1.5rem" }}>
        <h1>Choose a seller plan</h1>
        <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
          To access your seller dashboard and start uploading, you need an active plan.
          Pick a plan below and complete the Razorpay payment.
        </p>

        <div
          style={{
            marginTop: "2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: "#f9fafb",
                borderRadius: "1rem",
                padding: "1.5rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 6px 16px rgba(15, 23, 42, 0.08)",
              }}
            >
              <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                {plan.name}
              </h2>
              <p
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                }}
              >
                ₹{plan.price}
                <span style={{ fontSize: "0.85rem", fontWeight: 400 }}>
                  {" "}
                  / 6 months
                </span>
              </p>
              <ul style={{ fontSize: "0.9rem", color: "#4b5563", paddingLeft: "1.1rem" }}>
                <li>Up to {plan.maxUploads} uploads</li>
                <li>Max price ₹{plan.maxPrice} per image</li>
                <li>Listing duration {plan.durationDays} days</li>
              </ul>
              <button
                onClick={() => handleChoosePlan(plan)}
                disabled={processingPlanId === plan.id}
                style={{
                  marginTop: "1.1rem",
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, #6366f1, #a855f7)",
                  color: "white",
                  fontSize: "0.95rem",
                  boxShadow: "0 10px 24px rgba(129, 140, 248, 0.35)",
                  opacity: processingPlanId === plan.id ? 0.7 : 1,
                }}
              >
                {processingPlanId === plan.id
                  ? "Processing..."
                  : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Active plan – show real dashboard
  return (
    <div style={{ maxWidth: 960, margin: "3rem auto", padding: "0 1.5rem" }}>
      <h1>Seller Dashboard</h1>
      <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
        Plan: <strong>{profile.planName}</strong> •{" "}
        Uploads limit: <strong>{profile.maxUploads}</strong> • Max price per
        image: <strong>₹{profile.maxPrice}</strong>
      </p>

      <p style={{ marginTop: "1.25rem", color: "#4b5563" }}>
        Your full upload and earnings UI can sit here (as we build it out). For
        now, your dashboard is unlocked only because you have an active, paid
        plan.
      </p>
    </div>
  );
}

export default SellerDashboard;
