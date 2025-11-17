// src/pages/SellerDashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// you can later hook real stats here

const SellerDashboard = () => {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged-in as seller
  useEffect(() => {
    if (!user || !isSeller) {
      navigate("/seller-login", { replace: true });
    }
  }, [user, isSeller, navigate]);

  if (!user || !isSeller) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <h1 className="page-title">Seller Dashboard</h1>
        <p className="page-subtitle">
          Welcome, {user.displayName || user.email}. Manage your uploads,
          earnings and plans.
        </p>

        <div className="dashboard-grid">
          <div className="dashboard-widget">
            <h2>Total Earnings</h2>
            <p className="dashboard-number">₹0.00</p>
            <p className="dashboard-muted">
              Connect your Razorpay statements to reconcile.
            </p>
          </div>

          <div className="dashboard-widget">
            <h2>Active Plan</h2>
            <p className="dashboard-number">Starter / Pro / Elite</p>
            <p className="dashboard-muted">
              Show the active plan details here (limit, expiry etc.).
            </p>
          </div>

          <div className="dashboard-widget">
            <h2>Uploads</h2>
            <p className="dashboard-number">0 photos</p>
            <p className="dashboard-muted">
              Later you can extend this to list and manage photos.
            </p>
          </div>
        </div>

        <div className="dashboard-footer">
          <button
            className="btn-primary"
            onClick={() => navigate("/explore")}
          >
            View public gallery
          </button>
        </div>
      </section>
    </main>
  );
};

export default SellerDashboard;
