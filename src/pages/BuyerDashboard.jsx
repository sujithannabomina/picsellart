// src/pages/BuyerDashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, profile, loading, logout } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/buyer-login");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <main className="page">
        <div className="muted">Loading…</div>
      </main>
    );
  }

  if (!user) return null;

  if (profile?.role !== "buyer") {
    return (
      <main className="page">
        <h1>Buyer Dashboard</h1>
        <p className="muted">This account is not set as a Buyer. Please login as Buyer.</p>
        <button className="btn btn-primary" onClick={() => navigate("/buyer-login")}>
          Go to Buyer Login
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="dash">
        <h1>Buyer Dashboard</h1>
        <p className="muted">Welcome, {profile?.displayName || "Buyer"}. Your purchases and downloads will appear here.</p>

        <div className="dash-box">
          <div><b>Email:</b> {profile?.email || user.email}</div>
          <div><b>UID:</b> {user.uid}</div>

          <div className="dash-actions">
            <button className="btn btn-primary" onClick={() => navigate("/explore")}>
              Explore Pictures
            </button>
            <button className="btn" onClick={logout}>
              Logout
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <b>Your Purchases</b> <span className="muted">(Coming Next):</span>
            <div className="muted" style={{ marginTop: 6 }}>
              Once Razorpay purchase is connected, we'll list your bought items here with download buttons.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
