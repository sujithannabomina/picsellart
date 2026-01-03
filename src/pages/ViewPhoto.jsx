import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useAuth } from "../context/AuthContext";

function priceFromName(name) {
  const match = name.match(/\d+/);
  const n = match ? parseInt(match[0], 10) : 1;
  return 120 + (n % 80);
}

export default function ViewPhoto() {
  const { fileName } = useParams();
  const decoded = decodeURIComponent(fileName || "");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);

      // Try expected path first
      const tryPaths = [`public/images/${decoded}`, `public/${decoded}`];

      for (const p of tryPaths) {
        try {
          const u = await getDownloadURL(ref(storage, p));
          if (alive) {
            setUrl(u);
            setLoading(false);
          }
          return;
        } catch (e) {}
      }

      if (alive) setLoading(false);
    })();

    return () => (alive = false);
  }, [decoded]);

  const onBuy = () => {
    if (!user) {
      navigate(`/buyer-login?redirect=${encodeURIComponent(`/checkout/${decoded}`)}`);
      return;
    }
    navigate(`/checkout/${encodeURIComponent(decoded)}`);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900">
        ← Back
      </button>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Street Photography</h1>
          <p className="text-gray-500 mt-1">{decoded}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">₹{priceFromName(decoded)}</div>
          <div className="text-sm text-gray-500">Standard digital license</div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border overflow-hidden bg-white">
        {loading ? (
          <div className="p-10 text-gray-600">Loading...</div>
        ) : url ? (
          <img src={url} alt={decoded} className="w-full max-h-[520px] object-cover" />
        ) : (
          <div className="p-10 text-gray-600">Image not found in Storage.</div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-full border bg-white hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onBuy}
          className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Buy Now
        </button>
      </div>
    </main>
  );
}
