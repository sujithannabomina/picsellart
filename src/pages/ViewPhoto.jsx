// FILE PATH: src/pages/ViewPhoto.jsx
// ✅ FIXED: Shows full image without cropping

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import WatermarkedImage from "../components/WatermarkedImage";

function safeDecode(value, times = 2) {
  let v = value;
  for (let i = 0; i < times; i++) {
    try {
      const decoded = decodeURIComponent(v);
      if (decoded === v) break;
      v = decoded;
    } catch {
      break;
    }
  }
  return v;
}

export default function ViewPhoto() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const decodedId = useMemo(() => safeDecode(id || "", 3), [id]);

  const storagePath = useMemo(() => {
    if (!decodedId) return "";

    if (decodedId.startsWith("sample-")) {
      const raw = decodedId.replace("sample-", "");
      return safeDecode(raw, 3);
    }

    if (decodedId.endsWith(".jpg") || decodedId.endsWith(".png") || decodedId.endsWith(".jpeg")) {
      return `public/images/${decodedId}`;
    }

    return decodedId;
  }, [decodedId]);

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!storagePath) {
        setErr("Invalid photo.");
        setLoading(false);
        return;
      }
      setErr("");
      setLoading(true);
      try {
        const u = await getDownloadURL(ref(storage, storagePath));
        if (alive) setUrl(u);
      } catch (e) {
        if (alive) setErr("Unable to load this photo.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [storagePath]);

  const buyUrl = useMemo(() => {
    const sampleId = decodedId.startsWith("sample-")
      ? decodedId
      : `sample-${encodeURIComponent(storagePath)}`;
    return `/checkout?type=sample&id=${encodeURIComponent(sampleId)}`;
  }, [decodedId, storagePath]);

  const onBuy = () => {
    if (user) navigate(buyUrl);
    else navigate("/buyer-login", { state: { next: buyUrl } });
  };

  return (
    <div className="psa-container">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="psa-title">Photo Preview</h1>
          <p className="psa-subtitle mt-1">Watermarked preview shown below.</p>
        </div>
        <button className="psa-btn-soft" onClick={() => navigate("/explore")}>
          Back to Explore
        </button>
      </div>

      <div className="psa-card p-4 sm:p-6">
        {loading ? (
          <div className="w-full aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse" />
        ) : err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : (
          /* ✅ FIXED: Using aspect-ratio instead of fixed height - shows full image */
          <WatermarkedImage src={url} alt="Preview" className="w-full aspect-[4/3]" />
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            To download the full file, purchase this photo.
          </div>
          <div className="flex gap-2">
            <button className="psa-btn-primary" onClick={onBuy}>
              Buy
            </button>
            <button className="psa-btn-soft" onClick={() => navigate("/explore")}>
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}