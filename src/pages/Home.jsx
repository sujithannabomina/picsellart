// src/pages/Home.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const LOCAL_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function pickThreeRandomImages() {
  const shuffled = [...LOCAL_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

const Home = () => {
  const navigate = useNavigate();
  const galleryImages = useMemo(() => pickThreeRandomImages(), []);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
      <section className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-violet-600 mb-2">
            Sell once • Earn many times
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Turn your photos into income.
          </h1>
          <p className="text-slate-700 text-base md:text-lg mb-6">
            Architects, designers, bloggers, marketing agencies and businesses
            buy licensed images from Picsellart. You upload once — we handle
            secure checkout and instant downloads.
          </p>
          <ul className="list-disc list-inside text-slate-700 mb-8 space-y-1 text-sm md:text-base">
            <li>Set your own price within your selected seller plan.</li>
            <li>
              Picsellart watermark on previews — clean, full-resolution file
              after purchase.
            </li>
            <li>Track views, sales and earnings from your dashboard.</li>
          </ul>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => navigate("/buyer-login")}
              className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-900 text-sm font-medium hover:border-violet-400 hover:text-violet-700 transition"
            >
              Buyer Login
            </button>
            <button
              onClick={() => navigate("/seller-login")}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition"
            >
              Become a Seller
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="px-4 py-2 rounded-full border border-transparent text-sm font-medium text-violet-700 hover:border-violet-300 hover:bg-violet-50 transition"
            >
              Explore Pictures
            </button>
          </div>
        </div>

        {/* Local sample gallery */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Sample marketplace images
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            These examples come from your local <code>/public/images</code>{" "}
            folder. A different set of three will appear on each visit.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((src) => (
              <div
                key={src}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={src}
                    alt="Picsellart sample"
                    className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                  <span className="absolute bottom-2 left-3 text-[10px] tracking-[0.25em] uppercase text-slate-100 drop-shadow">
                    PICSELLART SAMPLE
                  </span>
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-slate-900">
                    Street Photography
                  </p>
                  <p className="text-xs text-slate-500">
                    From your local sample images
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Home;
