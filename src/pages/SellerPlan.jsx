// src/pages/SellerPlan.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createOrderClient, launchRazorpay } from "../utils/loadRazorpay";

const PLANS = [
  { id: "starter", name: "Starter", priceINR: 100, uploads: 25, maxPrice: 199, days: 180 },
  { id: "pro", name: "Pro", priceINR: 300, uploads: 30, maxPrice: 249, days: 180 },
  { id: "elite", name: "Elite", priceINR: 800, uploads: 50, maxPrice: 249, days: 180 },
];

export default function SellerPlan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleBuy(plan) {
    if (!user) {
      alert("Please login as seller first.");
      navigate("/seller/login");
      return;
    }
    setLoading(true);
    try {
      // 1️⃣ Create Razorpay order via backend
      const order = await createOrderClient({
        amount: plan.priceINR * 100, // convert to paisa
        currency: "INR",
        planId: plan.id,
        userId: user.uid,
      });

      // 2️⃣ Launch Razorpay checkout
      await launchRazorpay({
        order,
        user,
        onSuccess: () => {
          alert("Payment successful! Your plan will be activated shortly.");
          navigate("/seller/dashboard");
        },
      });
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Choose a Seller Plan</h1>
        <p className="page-desc">
          Select a plan to unlock upload access and start selling on Picsellart.
        </p>

        <div className="grid grid--3" style={{ marginTop: 24 }}>
          {PLANS.map((plan) => (
            <div key={plan.id} className="card">
              <div className="card-body">
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                  {plan.name}
                </h2>
                <p className="muted" style={{ marginBottom: 12 }}>
                  {plan.uploads} uploads · Max ₹{plan.maxPrice} per photo
                </p>
                <div style={{ fontSize: 22, fontWeight: 800 }}>
                  ₹{plan.priceINR}
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Valid for {plan.days} days
                </div>

                <button
                  onClick={() => handleBuy(plan)}
                  className="btn btn--brand"
                  disabled={loading}
                  style={{ marginTop: 16, width: "100%" }}
                >
                  {loading ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 32 }}>
          <div className="card-body">
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Need help?</h3>
            <p className="muted">
              Having trouble purchasing?{" "}
              <a href="/contact" className="link">
                Contact our support team
              </a>{" "}
              and we’ll help you set up your plan.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
