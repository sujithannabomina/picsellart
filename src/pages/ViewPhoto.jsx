// src/pages/ViewPhoto.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

function parseIndex(file) {
  const m = String(file || "").match(/sample(\d+)\.jpg/i);
  return m ? Number(m[1]) : null;
}

export default function ViewPhoto() {
  const params = useParams();
  const fileName =
    params?.filename || params?.file || params?.name || params?.id || params?.photoId;

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const idx = useMemo(() => parseIndex(fileName), [fileName]);
  const price = useMemo(() => (idx ? 120 + idx : 149), [idx]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);

        // sample images are stored in Firebase Storage: public/images/sampleX.jpg
        const fileRef = ref(storage, `public/images/${fileName}`);
        const dl = await getDownloadURL(fileRef);

        if (alive) setUrl(dl);
      } catch (e) {
        // fallback: keep route image if your app serves it
        if (alive) setUrl(`/photo/${fileName}`);
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (fileName) load();
    return () => {
      alive = false;
    };
  }, [fileName]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/explore" className="text-sm text-gray-600 hover:text-gray-900">
        ← Back
      </Link>

      <div className="mt-6 flex flex-col lg:flex-row items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Street Photography</h1>
          <div className="mt-1 text-gray-500">{fileName}</div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">₹{price}</div>
          <div className="text-sm text-gray-500">Standard digital license</div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border bg-white overflow-hidden">
        <div className="bg-gray-50 flex items-center justify-center">
          {loading ? (
            <div className="py-16 text-gray-600">Loading…</div>
          ) : (
            <img
              src={url}
              alt={fileName}
              className="w-full max-h-[70vh] object-contain"
              loading="lazy"
            />
          )}
        </div>

        <div className="p-5 flex flex-wrap gap-3 items-center justify-between">
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-full border font-semibold hover:bg-gray-50 transition"
          >
            Back
          </Link>

          <Link
            to={`/checkout?photo=${encodeURIComponent(fileName || "")}&price=${encodeURIComponent(
              price
            )}`}
            className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
