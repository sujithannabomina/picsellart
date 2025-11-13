// src/pages/LandingPage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const landingImages = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function getRandomThree() {
  const shuffled = [...landingImages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

const LandingPage = () => {
  const navigate = useNavigate();

  // Pick 3 random images once per mount
  const heroSet = useMemo(() => getRandomThree(), []);

  const goExplore = () => navigate("/explore");
  const goSellerLogin = () => navigate("/seller-login");
  const goBuyerLogin = () => navigate("/buyer-login");

  return (
    <section className="flex flex-col gap-10 lg:flex-row lg:items-center">
      {/* Left: image collage */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          {heroSet.map((src, idx) => (
            <div
              key={src}
              className={`rounded-3xl overflow-hidden shadow-lg bg-slate-200 ${
                idx === 1 ? "col-span-1 row-span-2 h-72" : "h-40"
              }`}
            >
              <img
                src={src}
                alt={`Featured sample ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right: copy + CTA */}
      <div className="flex-1 space-y-6">
        <p className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          Verified Sellers · Instant Downloads · Secure Payments
        </p>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Turn your <span className="text-indigo-600">Images</span> into Income
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-xl">
          Upload your street photography, interiors, designs or creative content and
          start selling to designers, architects and creators. Buyers get instant,
          watermark-free downloads after secure Razorpay checkout.
        </p>

        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Set your own price within your plan limits.</li>
          <li>• PicSellart watermark on previews – clean file after purchase.</li>
          <li>• Track views, sales and earnings from your dashboard.</li>
        </ul>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={goSellerLogin}
            className="rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-transform duration-150 hover:-translate-y-0.5"
          >
            Seller Login
          </button>

          <button
            onClick={goBuyerLogin}
            className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 hover:border-indigo-500 hover:text-indigo-700 shadow-sm hover:shadow-md transition duration-150"
          >
            Buyer Login
          </button>

          <button
            onClick={goExplore}
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 shadow-md hover:shadow-lg transition duration-150"
          >
            Explore Photos
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
