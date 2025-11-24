// src/components/ImageCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import WatermarkedImage from "./WatermarkedImage";

export default function ImageCard({ photo }) {
  const navigate = useNavigate();

  const viewPath = encodeURIComponent(photo.storagePath || photo.id);

  const handleView = () => {
    navigate(`/view/${viewPath}`);
  };

  const handleBuy = () => {
    navigate(`/view/${viewPath}?buy=1`);
  };

  return (
    <article className="photo-card">
      <div className="photo-thumb">
        <WatermarkedImage
          src={photo.url}
          alt={photo.title || "Street Photography"}
        />
      </div>

      <div className="photo-info">
        <div>
          <h3>Street Photography</h3>
          <p className="photo-filename">{photo.filename}</p>
        </div>

        <div className="photo-meta">
          <span className="photo-price">₹{photo.price}</span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              className="pill-button secondary"
              onClick={handleView}
            >
              View
            </button>
            <button
              type="button"
              className="pill-button primary"
              onClick={handleBuy}
            >
              Buy &amp; Download
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
