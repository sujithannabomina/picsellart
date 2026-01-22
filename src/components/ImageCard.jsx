// File: src/components/ImageCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

export default function ImageCard({ photo }) {
  const navigate = useNavigate();

  const title = photo.title || "Street Photography";
  const filename = photo.filename || photo.name || "image.jpg";
  const price = typeof photo.price === "number" ? photo.price : 120;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => navigate(`/photo/${encodeURIComponent(filename)}`)}
        className="block w-full"
        title="View"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={photo.thumbUrl || photo.url}
            alt={title}
            className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </button>

      <div className="p-5">
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{filename}</p>

        <p className="mt-2 text-base font-semibold text-slate-900">₹{price}</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => navigate(`/photo/${encodeURIComponent(filename)}`)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            View
          </button>

          <button
            onClick={() => navigate(`/checkout?photo=${encodeURIComponent(filename)}`)}
            className="flex-1 rounded-full bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-purple-700"
          >
            Buy
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">Standard digital license</p>
      </div>
    </div>
  );
}
