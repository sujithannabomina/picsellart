// src/pages/BuyerDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPurchasesForBuyer } from "../utils/purchases";

const BuyerDashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const isBuyer = user && role === "buyer";

  useEffect(() => {
    if (!user) {
      navigate("/buyer-login");
      return;
    }
    if (role !== "buyer") {
      navigate("/");
      return;
    }

    const load = async () => {
      try {
        const items = await getPurchasesForBuyer(user.uid);
        setPurchases(items);
      } catch (err) {
        console.error("Error loading purchases", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, role, navigate]);

  if (!isBuyer) {
    return null;
  }

  return (
    <main className="page-wrapper">
      <div className="page-inner">
        <header className="page-header">
          <h1 className="page-title">My Downloads</h1>
          <p className="page-subtitle">
            All photos you have purchased are listed here with download links.
          </p>
        </header>

        {loading && <p>Loading your purchases…</p>}

        {!loading && purchases.length === 0 && (
          <p>You haven&apos;t purchased any photos yet.</p>
        )}

        <section className="downloads-grid">
          {purchases.map((purchase) => (
            <article key={purchase.id} className="download-card">
              <div className="download-thumb">
                <img
                  src={purchase.downloadUrl}
                  alt={purchase.displayName}
                  loading="lazy"
                />
              </div>
              <div className="download-info">
                <h3>{purchase.displayName}</h3>
                <p className="download-filename">{purchase.fileName}</p>
                <p className="download-price">₹{purchase.price}</p>
                <a
                  href={purchase.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-button secondary"
                >
                  Download
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default BuyerDashboard;
