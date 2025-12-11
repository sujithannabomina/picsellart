// src/pages/ViewPhoto.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useAuth } from "../hooks/useAuth";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ViewPhoto = () => {
  const { id } = useParams(); // encoded fullPath
  const query = useQuery();
  const buyNow = query.get("buyNow") === "1";
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const fullPath = decodeURIComponent(id);
  const isPlatformSample = fullPath.startsWith("public/");

  const price = 199; // you can change or compute as needed

  useEffect(() => {
    async function loadPhoto() {
      try {
        setLoading(true);
        setError("");
        const storageRef = ref(storage, fullPath);
        const downloadUrl = await getDownloadURL(storageRef);
        setUrl(downloadUrl);
        const parts = fullPath.split("/");
        setFileName(parts[parts.length - 1]);
      } catch (err) {
        console.error(err);
        setError("Failed to load image.");
      } finally {
        setLoading(false);
      }
    }

    loadPhoto();
  }, [fullPath]);

  useEffect(() => {
    if (buyNow && !loading && !error) {
      handleBuy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyNow, loading, error]);

  const handleBuy = async () => {
    if (!user) {
      navigate("/buyer-login");
      return;
    }

    try {
      const res = await fetch("/api/createPhotoOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storagePath: fullPath,
          ownerType: isPlatformSample ? "platform" : "seller",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.warn("No checkoutUrl in response");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to start payment. Please try again.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
      <section className="max-w-5xl mx-auto">
        {loading && (
          <p className="text-sm text-slate-600">Loading image...</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {!loading && !error && (
          <>
            <header className="mb-5">
              <p className="text-xs font-semibold text-violet-600 mb-1">
                Street Photography
              </p>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {fileName}
              </h1>
              <p className="text-sm text-slate-600">
                {isPlatformSample
                  ? "Picsellart sample image"
                  : "Seller uploaded image"}
              </p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-6">
              <div className="relative w-full max-h-[70vh] overflow-hidden">
                <img
                  src={url}
                  alt={fileName}
                  className="w-full h-full object-contain bg-slate-900"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-4xl md:text-5xl font-black tracking-[0.5em] text-white/20 rotate-[-25deg]">
                    PICSELLART
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-600">Price</p>
                <p className="text-xl font-semibold text-slate-900">
                  ₹{price}
                </p>
              </div>
              <button
                onClick={handleBuy}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition"
              >
                Buy &amp; Download
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default ViewPhoto;
