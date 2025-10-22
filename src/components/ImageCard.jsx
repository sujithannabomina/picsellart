// src/components/ImageCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ImageCard({ photo }) {
  const navigate = useNavigate();

  const goDetails = () => {
    // If you already have /photo/:id page—navigate. Otherwise disable link visually.
    if (photo?.id) navigate(`/photo/${encodeURIComponent(photo.id)}`, { state: { photo } });
  };

  return (
    <div
      className="rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-white hover:shadow-md transition"
      role="article"
      aria-label={photo.title || "Photo"}
    >
      <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
        {photo?.url ? (
          <img
            src={photo.url}
            alt={photo.title || "photo"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
            Loading…
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="text-sm text-gray-800 truncate">{photo.title || "Untitled"}</div>
        {!!photo.tags?.length && (
          <div className="mt-1 flex flex-wrap gap-1">
            {photo.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[11px] rounded-full bg-gray-100 text-gray-600"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={goDetails}
            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            View / Buy
          </button>

          <a
            href={photo.url || "#"}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Preview
          </a>
        </div>
      </div>
    </div>
  );
}
