// src/components/ImageCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import WatermarkedImage from "./WatermarkedImage";

const ImageCard = ({ photo }) => {
  return (
    <Link to={`/view/${photo.id}`} className="photo-card">
      <div className="photo-thumb">
        <WatermarkedImage src={photo.url} alt={photo.title} />
      </div>

      <div className="photo-info">
        <div>
          <h3>{photo.title}</h3>
          <p className="photo-filename">{photo.filename}</p>
        </div>
        <div className="photo-meta">
          <span className="photo-price">₹{photo.price}</span>
        </div>
      </div>
    </Link>
  );
};

export default ImageCard;
