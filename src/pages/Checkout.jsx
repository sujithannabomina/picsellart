// src/pages/Checkout.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePhotos from "../hooks/usePhotos";
import { useAuth } from "../hooks/useAuth";

const Checkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { items, loading } = usePhotos();

  const item = useMemo(() => {
    const decoded = decodeURIComponent(id || "");
    return items.find((x) => x.id === decoded) || null;
  }, [items, id]);

  if (!user) {
    return (
      <div className="page">
        <div className="card">
          <h1>Please login</h1>
          <p style={{ color: "#6b7280" }}>Login as a buyer to continue checkout.</p>
          <button
            className="btn btn-nav-primary"
            onClick={() =>
              navigate(`/buyer-login?redirect=${encodeURIComponent(`/checkout/${encodeURIComponent(id || "")}`)}`)
            }
            style={{ marginTop: 12 }}
          >
            Buyer Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card">Loading…</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page">
        <div className="card">
          <h1>Item not found</h1>
          <button className="btn btn-nav" onClick={() => navigate("/explore")} style={{ marginTop: 12 }}>
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Checkout</h1>
        <p style={{ color: "#6b7280" }}>
          You are purchasing: <b>{item.title}</b>
        </p>

        <div style={{ marginTop: 10 }}>
          <img
            src={item.url}
            alt={item.title}
            style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 16 }}
          />
        </div>

        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 900 }}>Total: ₹{item.price}</div>
          <div style={{ color: "#6b7280" }}>{item.license}</div>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
          <button className="btn btn-nav" onClick={() => navigate(`/photo/${encodeURIComponent(item.id)}`)}>
            Back
          </button>

          {/* Razorpay wiring comes next step (webhook + verification) */}
          <button
            className="btn btn-nav-primary"
            onClick={() => alert("Razorpay checkout will be connected next (webhook + verification).")}
          >
            Pay with Razorpay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
