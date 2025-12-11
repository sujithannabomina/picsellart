// src/pages/ViewImage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";

const ViewImage = () => {
  const { folder, fileName } = useParams();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const folderPath = decodeURIComponent(folder);
        const name = decodeURIComponent(fileName);
        const imageRef = ref(storage, `${folderPath}/${name}`);
        const imageUrl = await getDownloadURL(imageRef);
        setUrl(imageUrl);
      } catch (err) {
        console.error("Error loading single image", err);
        setError("Unable to load this image.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [folder, fileName]);

  const decodedName = decodeURIComponent(fileName || "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50">
      <main className="max-w-4xl mx-auto px-4 py-10 md:py-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Image preview
          </h1>
          <Link
            to="/explore"
            className="text-xs md:text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Explore
          </Link>
        </div>

        <p className="text-xs text-slate-500 mb-4 break-all">
          {decodedName}
        </p>

        {loading && (
          <div className="text-slate-600 text-sm">Loading image…</div>
        )}

        {error && !loading && (
          <div className="text-red-600 text-sm font-medium">{error}</div>
        )}

        {!loading && !error && url && (
          <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={url}
                alt={decodedName}
                className="w-full max-h-[70vh] object-contain bg-slate-950"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-white/70 text-2xl md:text-3xl font-extrabold tracking-[0.3em] mix-blend-overlay rotate-[-20deg]">
                  PICSELLART
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewImage;
