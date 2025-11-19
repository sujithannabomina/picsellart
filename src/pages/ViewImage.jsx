// src/pages/ViewImage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPhotoUrl } from "../utils/storage";

export default function ViewImage() {
  const { id } = useParams(); // encoded path like "Buyer%2Fsample3.jpg"
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const fileName = decodeURIComponent(id || "").split("/").pop() || "image.jpg";

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const url = await fetchPhotoUrl(id);
        if (!ignore) setImageUrl(url);
      } catch (err) {
        console.error("Error fetching photo URL", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <button
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <span className="h-3 w-3 rounded-full bg-violet-500 shadow" />
            <span className="text-lg font-semibold tracking-tight">
              Picsellart
            </span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Back to Explore
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row">
        {/* Image */}
        <section className="flex-1">
          <div className="mx-auto max-w-xl rounded-3xl bg-slate-900 p-4 shadow-lg">
            <div className="relative overflow-hidden rounded-2xl bg-black">
              <div className="aspect-[4/3]">
                {loading ? (
                  <div className="h-full w-full animate-pulse bg-slate-800" />
                ) : (
                  <img
                    src={imageUrl}
                    alt={fileName}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              {/* Strong watermark on preview */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-white/80 text-3xl font-semibold tracking-[0.5em] drop-shadow-xl">
                  PICSELLART
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-300">
              Watermarked preview shown. Purchase to download the full
              resolution, clean image.
            </p>
          </div>
        </section>

        {/* Details / Licensing */}
        <section className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Street Photography
            </h1>
            <p className="mt-1 text-sm text-slate-500">{fileName}</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">₹799</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/buyer-login")}
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200 hover:brightness-110"
            >
              Buy &amp; Download
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Continue browsing
            </button>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Licensing &amp; usage
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Purchased files include a standard commercial license. You can use
              them in client work, social media, print and web designs. Reselling
              raw files or sharing the download link is not allowed.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              File delivery
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              After successful Razorpay payment, buyers receive instant access to
              a watermark-free, high-resolution file from their dashboard.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
