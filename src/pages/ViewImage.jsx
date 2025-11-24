// src/pages/ViewImage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { explorePhotos } from "../utils/exploreData";
import WatermarkedImage from "../components/WatermarkedImage";

const ViewImage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const photo = explorePhotos.find((p) => String(p.id) === String(id));

  if (!photo) {
    return (
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="page-title">Image not found</h1>
          <p className="page-subtitle">
            We couldn’t find this image. It may have been removed or the link is
            incorrect.
          </p>
          <button
            className="pill-button secondary"
            onClick={() => navigate("/explore")}
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <header className="page-header">
          <h1 className="page-title">{photo.title}</h1>
          <p className="page-subtitle">
            Public preview includes a Picsellart watermark for protection.
            Log in as a buyer to purchase and download a clean, full-resolution
            file.
          </p>
        </header>

        <div className="view-layout">
          {/* LEFT: BIG PREVIEW */}
          <div className="view-main-image">
            <WatermarkedImage src={photo.url} alt={photo.title} />
          </div>

          {/* RIGHT: DETAILS + ACTIONS */}
          <div className="view-meta">
            <div className="view-card">
              <p className="view-label">Filename</p>
              <p className="view-value">{photo.filename}</p>

              <p className="view-label">Price</p>
              <p className="view-price">₹{photo.price}</p>

              <p className="view-label">License</p>
              <p className="view-value">
                Standard commercial license for designs, ads, web and client
                work. Reselling the raw file is not allowed.
              </p>

              <div className="view-actions">
                <button
                  className="pill-button primary"
                  onClick={() => navigate("/buyer/login")}
                >
                  Login to Buy &amp; Download
                </button>
                <button
                  className="pill-button secondary"
                  onClick={() => navigate("/explore")}
                >
                  Back to Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImage;
