import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function ViewPhoto() {
  const { fileName } = useParams();
  const decoded = decodeURIComponent(fileName || "");
  const nav = useNavigate();
  const { user, roles } = useAuth();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const r = ref(storage, `public/images/${decoded}`);
        const u = await getDownloadURL(r);
        if (alive) setUrl(u);
      } catch {
        if (alive) setUrl("");
      } finally {
        if (alive) setLoading(false);
      }
    }
    if (decoded) load();
    return () => { alive = false; };
  }, [decoded]);

  const onBuy = () => {
    if (!user || !roles.buyer) {
      nav(`/buyer-login?next=${encodeURIComponent(`/checkout/${encodeURIComponent(decoded)}`)}`);
      return;
    }
    nav(`/checkout/${encodeURIComponent(decoded)}`);
  };

  return (
    <div>
      <h1 className="text-4xl font-semibold">Street Photography</h1>
      <p className="mt-1 text-black/60">{decoded}</p>

      {loading ? (
        <p className="mt-6 text-black/60">Loading…</p>
      ) : !url ? (
        <p className="mt-6 text-red-600">Image not found.</p>
      ) : (
        <div className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="aspect-[16/9] bg-black/5">
            <img src={url} alt={decoded} className="h-full w-full object-cover" />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="font-semibold">₹168</div>
            <div className="text-sm text-black/60">Standard digital license</div>
          </div>

          <div className="px-4 pb-4 flex gap-2">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="px-5 py-2 rounded-full border border-black/10 text-sm hover:bg-black/5"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onBuy}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm shadow hover:opacity-95"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
