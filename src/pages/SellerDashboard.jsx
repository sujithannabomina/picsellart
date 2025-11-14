// src/pages/SellerDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SELLER_PLANS, getPlanById } from "../utils/plans";
import {
  activateSellerPlan,
  ensureSellerProfile,
  getSellerProfile,
} from "../utils/seller";
import { openPlanCheckout } from "../utils/razorpay";

const SellerDashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState(null);

  const isSeller = user && role === "seller";

  useEffect(() => {
    if (!user) {
      navigate("/seller-login");
      return;
    }
    if (role !== "seller") {
      navigate("/");
      return;
    }

    const load = async () => {
      try {
        await ensureSellerProfile(user.uid, user.email);
        const p = await getSellerProfile(user.uid);
        setProfile(p);
      } catch (err) {
        console.error("Error loading seller profile", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, role, navigate]);

  const handleActivatePlan = async (plan) => {
    if (!user) return;
    try {
      setActivatingId(plan.id);
      await openPlanCheckout({
        user,
        plan,
        onSuccess: async () => {
          await activateSellerPlan(user.uid, plan.id);
          const updated = await getSellerProfile(user.uid);
          setProfile(updated);
          alert(`Plan "${plan.name}" activated successfully.`);
        },
      });
    } catch (err) {
      console.error("Error activating plan", err);
      alert("Plan activation failed or was cancelled.");
    } finally {
      setActivatingId(null);
    }
  };

  if (!isSeller) {
    return null;
  }

  const activePlan = profile?.activePlanId
    ? getPlanById(profile.activePlanId)
    : null;

  return (
    <main className="page-wrapper">
      <div className="page-inner">
        <header className="page-header">
          <h1 className="page-title">Seller Dashboard</h1>
          <p className="page-subtitle">
            Manage your plan, track uploads and monitor your earnings.
          </p>
        </header>

        {loading && <p>Loading your seller account…</p>}

        {!loading && (
          <>
            <section className="stats-row">
              <div className="stat-card">
                <p className="stat-label">Active Plan</p>
                <p className="stat-value">
                  {activePlan ? activePlan.name : "No plan active"}
                </p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Uploads used</p>
                <p className="stat-value">
                  {profile?.uploadCount || 0}
                  {activePlan && ` / ${activePlan.maxUploads}`}
                </p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Max price per image</p>
                <p className="stat-value">
                  {activePlan ? `₹${activePlan.maxPricePerImage}` : "–"}
                </p>
              </div>
            </section>

            {!activePlan && (
              <section className="plans-section">
                <h2>Choose a plan to start selling</h2>
                <div className="plans-grid">
                  {SELLER_PLANS.map((plan) => (
                    <article key={plan.id} className="plan-card">
                      <h3>{plan.name}</h3>
                      <p className="plan-price">₹{plan.price}</p>
                      <ul className="plan-details">
                        <li>{plan.maxUploads} uploads</li>
                        <li>Up to ₹{plan.maxPricePerImage} per image</li>
                        <li>{plan.durationDays} days visibility</li>
                        <li>{plan.highlight}</li>
                      </ul>
                      <button
                        className="pill-button primary"
                        disabled={activatingId === plan.id}
                        onClick={() => handleActivatePlan(plan)}
                      >
                        {activatingId === plan.id
                          ? "Processing…"
                          : "Activate Plan"}
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activePlan && (
              <section className="plans-section">
                <h2>Next steps</h2>
                <p>
                  Plan features like upload, editing and detailed sales stats
                  plug into this dashboard. You can continue integrating your
                  existing upload flow using the limits from your active plan.
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default SellerDashboard;
