// src/pages/ViewPhoto.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePhotos from "../hooks/usePhotos";
import { useAuth } from "../hooks/useAuth";

const ViewPhoto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { items, loading } = usePhotos();

  const item = useMemo(() => {
    const decoded = decodeURIComponent(id || "");
    return items.find((x) => x.id === decoded) || null;
  }, [items, id]);

  const onBuy = () => {
    if (!item) return;

    if (!user) {
      const redirectTo = `/checkout/${encodeURIComponent(item.id)}`;
      navigate(`/buyer-login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }

    navigate(`/checkout/${encodeURIComponent(item.id)}`);
  };

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
          <h1>Photo not found</h1>
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
        <h1>{item.title || "Photo"}</h1>
        <p style={{ color: "#6b7280" }}>{item.filename || ""}</p>

        <div style={{ marginTop: 12 }}>
          <img
            src={item.url}
            alt={item.title || "Photo"}
            style={{ width: "100%", maxHeight: 520, objectFit: "cover", borderRadius: 16 }}
          />
        </div>

        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 900 }}>₹{item.price}</div>
          <div style={{ color: "#6b7280" }}>{item.license}</div>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
          <button className="btn btn-nav" onClick={() => navigate("/explore")}>
            Back
          </button>
          <button className="btn btn-nav-primary" onClick={onBuy}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPhoto;
