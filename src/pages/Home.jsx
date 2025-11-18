import { useEffect, useState } from "react";
import { getLandingCandidates } from "../utils/storage";

export default function Home() {
  const [heroPhotos, setHeroPhotos] = useState([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const photos = await getLandingCandidates(3);
        if (!cancelled) setHeroPhotos(photos);
      } catch (err) {
        console.error("Error loading landing images", err);
        if (!cancelled) {
          setHeroPhotos([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
      {/* Left: image stack */}
      <div className="flex justify-center lg:justify-start">
        <div className="relative grid gap-6 sm:grid-cols-2">
          {[0, 1, 2].map((i) => {
            const photo = heroPhotos[i];
            const src = photo?.url;
            const fallback =
              i === 0
                ? "/images/sample1.jpg"
                : i === 1
                ? "/images/sample2.jpg"
                : "/images/sample3.jpg";

            return (
              <div
                key={i}
                className="relative h-44 w-44 overflow-hidden rounded-3xl bg-slate-200 shadow-lg sm:h-52 sm:w-52 lg:h-56 lg:w-56"
              >
                <img
                  src={src || fallback}
                  alt={photo?.name || "Picsellart sample"}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="text-white/75 text-sm font-semibold tracking-[0.3em] drop-shadow-md mix-blend-overlay">
                    PICSELLART
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: text */}
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Verified Sellers · Instant Downloads · Secure Payments
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Turn your Images
          <br />
          into Income
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-slate-600">
          Upload your street photography, interiors, designs or creative content
          and start selling to designers, architects and creators. Buyers get
          instant, watermark-free downloads after secure Razorpay checkout.
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• Set your own price within your plan limits.</li>
          <li>• Picsellart watermark on previews – clean file after purchase.</li>
          <li>• Track views, sales and earnings from your dashboard.</li>
        </ul>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="/seller-login"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg"
          >
            Seller Login
          </a>
          <a
            href="/buyer-login"
            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400"
          >
            Buyer Login
          </a>
          <a
            href="/explore"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Explore Photos
          </a>
        </div>
      </div>
    </section>
  );
}
