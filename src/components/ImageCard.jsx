// src/components/ImageCard.jsx
import React from "react";

const ImageCard = ({ photo, onView, onBuy }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col">
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={photo.url}
          alt={photo.title || photo.fileName}
          className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Watermark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
        <span className="absolute bottom-3 left-4 text-[11px] tracking-[0.3em] uppercase text-slate-100 drop-shadow">
          PICSELLART
        </span>
      </div>

      <div className="flex-1 flex flex-col px-4 py-3 gap-1">
        <h3 className="text-sm font-semibold text-slate-900 truncate">
          {photo.title || "Street Photography"}
        </h3>
        <p className="text-xs text-slate-500 truncate">{photo.fileName}</p>
        <p className="text-sm font-semibold text-slate-900 mt-1">
          ₹{photo.price}
          <span className="text-[11px] text-slate-500 ml-1">
            {photo.ownerType === "platform"
              ? "Picsellart sample"
              : "Seller image"}
          </span>
        </p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onView(photo)}
            className="flex-1 px-3 py-1.5 rounded-full border border-slate-300 text-xs font-medium text-slate-800 hover:border-violet-400 hover:text-violet-700 transition"
          >
            View
          </button>
          <button
            onClick={() => onBuy(photo)}
            className="flex-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-xs font-medium text-white shadow-sm hover:shadow-md transition"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
