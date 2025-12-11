// src/pages/Home.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const allLocalImages = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

const Home = () => {
  // pick 3 random images on each visit/refresh
  const featuredImages = useMemo(() => {
    const shuffled = [...allLocalImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50">
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Hero text */}
        <section className="grid gap-10 md:grid-cols-[1.1fr,1fr] items-center">
          <div>
            <p className="text-sm font-medium text-indigo-500 mb-2">
              Sell once • Earn many times
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4 md:mb-6">
              Turn your photos into income.
            </h1>
            <p className="text-slate-600 text-sm md:text-base mb-4 md:mb-6 leading-relaxed max-w-xl">
              Architects, designers, bloggers, marketing agencies and
              businesses buy licensed images from Picsellart. You upload once —
              we handle secure checkout and instant downloads.
            </p>

            <ul className="space-y-1.5 text-slate-700 text-sm md:text-base mb-6">
              <li>• Set your own price within your selected seller plan.</li>
              <li>
                • Picsellart watermark on previews — clean, full-resolution
                file after purchase.
              </li>
              <li>• Track views, sales and earnings from your dashboard.</li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/buyer-login"
                className="px-4 py-2 text-sm md:text-base rounded-full border border-slate-300 bg-white hover:bg-slate-50 shadow-sm transition"
              >
                Buyer Login
              </Link>
              <Link
                to="/seller-login"
                className="px-4 py-2 text-sm md:text-base rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition"
              >
                Become a Seller
              </Link>
              <Link
                to="/explore"
                className="px-4 py-2 text-sm md:text-base rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
              >
                Explore Pictures
              </Link>
            </div>
          </div>

          {/* Hero mini-gallery */}
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              From the Picsellart marketplace
            </div>
            <div className="flex gap-3">
              {featuredImages.map((src) => (
                <div
                  key={src}
                  className="flex-1 rounded-3xl overflow-hidden shadow-md bg-slate-200"
                >
                  <img
                    src={src}
                    alt="Sample from Picsellart"
                    className="w-full h-56 md:h-64 object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
