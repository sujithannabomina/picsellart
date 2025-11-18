// src/pages/ViewImage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPhotoUrl } from "../utils/storage";

export default function ViewImage() {
  const { "*": encodedPath } = useParams(); // React Router v6 splat route
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storagePath = decodeURIComponent(encodedPath || "");
  const fileName = storagePath.split("/").pop() || "image.jpg";

  // Simple mock price based on name (keep consistent with Explore)
  function getPriceForFile(name) {
    const prices = [399, 499, 599, 799];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash + name.charCodeAt(i)) % prices.length;
    }
    return prices[hash];
  }

  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      if (!storagePath) {
        setError("Invalid image.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = await fetchPhotoUrl(storagePath);
        if (!cancelled) {
          setImageUrl(url);
          setError("");
        }
      } catch (err) {
        console.error("Error loading image", storagePath, err);
        if (!cancelled) {
          setError("Unable to load this image. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [storagePath]);

  const price = getPriceForFile(fileName);

  return (
    <div className="min-h-screen bg-slate-100 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <button
          type="button"
          onClick={() => navigate("/explore")}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <span className="text-lg">←</span>
          Back to Explore
        </button>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* Image panel */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-xl rounded-[32px] bg-slate-900 p-4 shadow-2xl shadow-slate-900/40">
              <div className="relative overflow-hidden rounded-[28px] bg-slate-900">
                {loading && (
                  <div className="h-[420px] w-full animate-pulse bg-slate-700/60" />
                )}
                {!loading && imageUrl && (
                  <>
                    <img
                      src={imageUrl}
                      alt={fileName}
                      className="h-[420px] w-full object-cover"
                    />
                    {/* Strong watermark overlay */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="select-none text-5xl font-black tracking-[0.5em] text-white/45 mix-blend-soft-light rotate-[-26deg]">
                        PICSELLART
                      </span>
                    </div>
                  </>
                )}
              </div>
              <p className="mt-3 px-1 text-[11px] text-slate-300/90">
                Watermarked preview shown. Purchase to download the full
                resolution, clean image.
              </p>
            </div>
          </div>

          {/* Details panel */}
          <div className="flex flex-col justify-center">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Street Photography
              </h1>
              <p className="mt-1 text-xs text-slate-500">{fileName}</p>
              <p className="mt-4 text-xl font-semibold text-slate-900">
                ₹{price}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:brightness-105"
                >
                  Buy &amp; Download
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/explore")}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                  Continue browsing
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm shadow-slate-200/70">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Licensing &amp; usage
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Purchased files include a standard commercial license. You can
                use them in client work, social media, print and web designs.
                Reselling raw files or sharing the download link is not allowed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
