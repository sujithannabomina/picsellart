import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPhotoUrl } from "../utils/storage";

export default function ViewImage() {
  const navigate = useNavigate();
  const { storagePath } = useParams();
  const decodedPath = decodeURIComponent(storagePath || "");

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchPhotoUrl(decodedPath);
        if (active) setPhoto(data);
      } catch (e) {
        console.error("Error loading image", e);
        if (active) setError("Unable to load this image.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [decodedPath]);

  return (
    <section className="pt-8 md:pt-10">
      <button
        onClick={() => navigate("/explore")}
        className="mb-6 inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-50"
      >
        ← Back to Explore
      </button>

      {loading && <p className="text-sm text-slate-600">Loading image…</p>}
      {error && !loading && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {photo && !loading && !error && (
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-start">
          {/* Image */}
          <div className="rounded-[32px] bg-slate-900/95 p-4 md:p-6 shadow-[0_20px_45px_rgba(15,23,42,0.75)]">
            <div className="relative overflow-hidden rounded-3xl bg-slate-800 max-h-[70vh]">
              <img
                src={photo.url}
                alt={photo.name}
                className="h-full w-full object-contain bg-black"
              />
              <div className="absolute inset-0 bg-black/25" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-white/85 text-3xl md:text-4xl font-semibold tracking-[0.4em] [text-shadow:0_0_16px_rgba(0,0,0,1)]">
                  PICSELLART
                </span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-300 text-center">
              Watermarked preview shown. Purchase to download the full
              resolution, clean image.
            </p>
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Street Photography
              </h1>
              <p className="text-xs text-slate-500 mt-1">{photo.name}</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                ₹{photo.price.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg">
                Buy &amp; Download
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Continue browsing
              </button>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 text-xs text-slate-700 space-y-3">
              <h2 className="font-semibold text-slate-900">
                Licensing &amp; usage
              </h2>
              <p>
                Purchased files include a standard commercial license. You can
                use them in client work, social media, print and web designs.
              </p>
              <p>
                Reselling raw files or sharing the download link is not allowed.
                Each purchase is for a single buyer account.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
