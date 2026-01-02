// src/pages/SellerDashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PLANS = [
  { id: "starter", name: "Starter", price: 100, durationDays: 180, maxUploads: 25, maxPrice: 199 },
  { id: "pro", name: "Pro", price: 300, durationDays: 180, maxUploads: 30, maxPrice: 249 },
  { id: "elite", name: "Elite", price: 800, durationDays: 180, maxUploads: 50, maxPrice: 249 },
];

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading, logout } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/seller-login");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <main className="page">
        <div className="muted">Loading…</div>
      </main>
    );
  }

  if (!user) return null;

  if (profile?.role !== "seller") {
    return (
      <main className="page">
        <h1>Seller Dashboard</h1>
        <p className="muted">This account is not set as a Seller. Please login as Seller.</p>
        <button className="btn btn-primary" onClick={() => navigate("/seller-login")}>
          Go to Seller Login
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="dash">
        <h1>Seller Dashboard</h1>
        <p className="muted">Welcome, {profile?.displayName || "Seller"}. Manage your plan, uploads and pricing limits here.</p>

        <div className="dash-box">
          <div><b>Email:</b> {profile?.email || user.email}</div>
          <div><b>UID:</b> {user.uid}</div>

          <div className="dash-actions">
            <button className="btn btn-primary" onClick={() => navigate("/explore")}>
              View Marketplace
            </button>
            <button className="btn" onClick={logout}>
              Logout
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <b>Your Seller Plan</b>
            <div className="muted" style={{ marginTop: 6 }}>
              Select a plan to start uploading. <span className="pill">Payment hookup next.</span>
            </div>

            <div className="plan-grid">
              {PLANS.map((p) => (
                <div key={p.id} className="plan">
                  <h3>{p.name}</h3>
                  <div className="muted">Price: ₹{p.price} • Duration: <b>{p.durationDays} days</b></div>
                  <div className="muted">Max uploads: <b>{p.maxUploads}</b></div>
                  <div className="muted">Max price/image: <b>₹{p.maxPrice}</b></div>

                  <button className="btn btn-primary" onClick={() => navigate("/seller/upload")}>
                    Choose Plan
                  </button>
                </div>
              ))}
            </div>

            <div className="muted" style={{ marginTop: 12 }}>
              Next step: connect Razorpay payment so plan activation becomes real + secure (server-side verification).
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
