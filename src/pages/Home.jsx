// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLandingCandidates } from "../utils/storage";

export default function Home() {
  const navigate = useNavigate();
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const items = await getLandingCandidates(3);
        if (!ignore) setHeroImages(items);
      } catch (err) {
        console.error("Error loading landing images", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
          >
            <span className="h-3 w-3 rounded-full bg-violet-500 shadow" />
            <span className="text-lg font-semibold tracking-tight">
              Picsellart
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
            <button onClick={() => navigate("/explore")}>Explore</button>
            <button onClick={() => navigate("/faq")}>FAQ</button>
            <button onClick={() => navigate("/contact")}>Contact</button>
            <button onClick={() => navigate("/refunds")}>Refunds</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/buyer-login")}
              className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Buyer Login
            </button>
            <button
              onClick={() => navigate("/seller-login")}
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-violet-200 hover:brightness-110"
            >
              Seller Login
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-center">
        {/* Left: sample images */}
        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            {loading && (
              <div className="h-48 rounded-3xl bg-slate-200 animate-pulse" />
            )}
            {!loading &&
              heroImages.slice(0, 2).map((img) => (
                <div
                  key={img.id}
                  className="relative h-40 overflow-hidden rounded-3xl bg-slate-200 shadow-md"
                >
                  <img
                    src={img.url}
                    alt={img.fileName}
                    className="h-full w-full object-cover"
                  />
                  {/* Strong watermark */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="text-white/75 text-3xl font-semibold tracking-[0.4em] drop-shadow-lg">
                      PICSELLART
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <div className="hidden flex-1 lg:block">
            {loading && (
              <div className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            )}
            {!loading && heroImages[2] && (
              <div className="relative h-64 overflow-hidden rounded-3xl bg-slate-200 shadow-md">
                <img
                  src={heroImages[2].url}
                  alt={heroImages[2].fileName}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="text-white/75 text-4xl font-semibold tracking-[0.4em] drop-shadow-lg">
                    PICSELLART
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: hero copy */}
        <section className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">
            Verified Sellers · Instant Downloads · Secure Payments
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Turn your images into{" "}
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              income
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
            Upload your street photography, interiors, designs or creative
            content and start selling to designers, architects and creators.
            Buyers get instant, watermark-free downloads after secure Razorpay
            checkout.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Set your own price within your plan limits.</li>
            <li>• Picsellart watermark on previews – clean file after purchase.</li>
            <li>• Track views, sales and earnings from your dashboard.</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/seller-login")}
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200 hover:brightness-110"
            >
              Seller Login
            </button>
            <button
              onClick={() => navigate("/buyer-login")}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Buyer Login
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-slate-50"
            >
              Explore Photos
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
