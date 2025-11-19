import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLandingCandidates } from "../utils/storage";

export default function Home() {
  const navigate = useNavigate();
  const [heroPhotos, setHeroPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const photos = await getLandingCandidates();
        if (active) setHeroPhotos(photos);
      } catch (e) {
        console.error("Error loading landing images", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="pt-10 md:pt-14">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] items-center">
        {/* Left: stacked preview images */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {(loading ? [1, 2, 3] : heroPhotos).map((photo, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl bg-slate-200 overflow-hidden shadow-[0_18px_40px_rgba(15,23,42,0.26)] ${
                  idx === 0
                    ? "col-span-2 h-56 md:h-64"
                    : "h-40 md:h-44"
                }`}
              >
                {loading ? (
                  <div className="h-full w-full animate-pulse bg-slate-300" />
                ) : (
                  <>
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {/* strong watermark */}
                    <div className="absolute inset-0 bg-black/25" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="text-white/80 text-3xl md:text-4xl font-semibold tracking-[0.4em] [text-shadow:0_0_10px_rgba(0,0,0,0.9)]">
                        PICSELLART
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: text & CTAs */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-slate-500 mb-3">
            Verified Sellers · Instant Downloads · Secure Payments
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Turn your images into income
          </h1>
          <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-5 md:mb-6 max-w-xl">
            Upload your street photography, interiors, designs or creative
            content and start selling to designers, architects and creators.
            Buyers get instant, watermark-free downloads after secure Razorpay
            checkout.
          </p>
          <ul className="space-y-2 text-sm text-slate-700 mb-7">
            <li>• Set your own price within your plan limits.</li>
            <li>• Picsellart watermark on previews – clean file after purchase.</li>
            <li>• Track views, sales and earnings from your dashboard.</li>
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/seller-login")}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg"
            >
              Seller Login
            </button>
            <button
              onClick={() => navigate("/buyer-login")}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
            >
              Buyer Login
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Explore Photos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
