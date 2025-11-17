// src/pages/BuyerDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPurchasesForBuyer } from "../utils/purchases";

const BuyerDashboard = () => {
  const { user, isBuyer } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect if not logged-in as buyer
  useEffect(() => {
    if (!user || !isBuyer) {
      navigate("/buyer-login", { replace: true });
    }
  }, [user, isBuyer, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const data = await getPurchasesForBuyer(user.uid);
        setPurchases(data);
      } catch (err) {
        console.error("Failed to load purchases:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user || !isBuyer) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <h1 className="page-title">My Downloads</h1>
        <p className="page-subtitle">
          Welcome, {user.displayName || user.email}. View and download your
          purchased files any time.
        </p>

        {loading && <div className="page-loading">Loading purchases…</div>}

        {!loading && purchases.length === 0 && (
          <div className="empty-state">
            <p>You haven’t purchased any images yet.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/explore")}
            >
              Browse images
            </button>
          </div>
        )}

        {!loading && purchases.length > 0 && (
          <div className="purchase-grid">
            {purchases.map((purchase) => (
              <article key={purchase.id} className="purchase-card">
                <img
                  src={purchase.previewUrl}
                  alt={purchase.fileName}
                  className="purchase-thumb"
                />
                <div className="purchase-body">
                  <h3>{purchase.title || purchase.fileName}</h3>
                  <p className="purchase-meta">
                    ₹{purchase.amount / 100} ·{" "}
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </p>
                  <a
                    href={purchase.downloadUrl}
                    className="btn-secondary small"
                  >
                    Download
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default BuyerDashboard;
