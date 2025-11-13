import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLandingCandidates } from "../utils/storage";

export default function Home() {
  const navigate = useNavigate();
  const [imgs, setImgs] = useState([]);

  // pick 3 of up to 6 candidates from storage on mount
  useEffect(() => {
    (async () => {
      const cands = await getLandingCandidates(6); // from /public and /Buyer
      // shuffle and pick 3
      const picks = [...cands].sort(() => 0.5 - Math.random()).slice(0, 3);
      setImgs(picks);
    })();
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="w-full space-y-5">
        <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200">
          {/* simple carousel: show first of the 3; rotate on refresh/brand since picks are randomized */}
          {imgs[0] && (
            <img
              src={imgs[0].url}
              alt={imgs[0].name}
              className="w-full h-[420px] object-cover"
              loading="eager"
            />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
          Turn your Images into Income
        </h1>
        <p className="text-slate-700">
          Upload your Photos, designs, or creative content and start selling to
          designers, architects and creators today. |
          <b> Verified Sellers</b> | <b>Instant Downloads</b> | <b>Secure Payments</b>
        </p>

        <div className="flex flex-wrap gap-12">
          <button
            className="px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg"
            onClick={() => navigate("/seller-gateway")}
          >
            Seller Login
          </button>
          <button
            className="px-5 py-3 rounded-full bg-slate-200 text-slate-900 font-semibold"
            onClick={() => navigate("/buyer-dashboard")}
          >
            Buyer Login
          </button>
          <button
            className="px-5 py-3 rounded-full bg-slate-900 text-white font-semibold"
            onClick={() => navigate("/explore")}
          >
            Explore Photos
          </button>
        </div>
      </div>
    </section>
  );
}
