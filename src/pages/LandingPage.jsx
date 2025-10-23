// src/pages/LandingPage.jsx
import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * We render 3 random samples from /public/images/sample{1..6}.jpg
 * This does NOT hit Firebase — it's instant and always available.
 */
const SAMPLE_POOL = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function pickRandom(count = 3) {
  const pool = [...SAMPLE_POOL];
  const chosen = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }
  return chosen;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const randomImages = useMemo(() => pickRandom(3), []);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-5xl font-semibold leading-tight tracking-tight">
              Turn your Images into Income
            </h1>
            <p className="mt-4 text-neutral-600 text-base sm:text-lg">
              Upload your Photos, designs, or creative content and start selling to designers,
              architects and creators today.
              | Secure Payments | Verified Sellers | Instant Downloads |
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/explore"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brand-600 text-white shadow-soft hover:bg-brand-700 transition"
              >
                Explore Photos
              </Link>
              <button
                onClick={() => navigate("/buyer/login")}
                className="px-5 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition"
                aria-label="Buyer Login"
                title="Buyer Login"
              >
                Buyer Login
              </button>
              <button
                onClick={() => navigate("/seller/login")}
                className="px-5 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition"
                aria-label="Seller Login"
                title="Seller Login"
              >
                Seller Login
              </button>
            </div>

            {/* Selling points */}
            <ul className="mt-6 space-y-2 text-sm text-neutral-700">
              <li>• Sellers pay after login and get access for 180 days.</li>
              <li>• Upload limits & per-image price caps are enforced by plan.</li>
              <li>
                • Buyers & Sellers have focused dashboards to track purchases,
                uploads, and earnings.
              </li>
              <li>• Watermarked previews; originals only after payment.</li>
            </ul>
          </div>

          {/* Random gallery */}
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            {randomImages.map((src, i) => (
              <div
                key={src}
                className="aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-soft"
              >
                <img
                  src={src}
                  alt={`Showcase sample ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features summary */}
      <section className="border-t border-neutral-100 bg-neutral-50">
        <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <h3 className="font-semibold">For Buyers</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Smart search, quick checkout (Razorpay), secure delivery of the
              original. Your dashboard stores licenses & downloads.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <h3 className="font-semibold">For Sellers</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Upload with automatic watermark, set prices within your plan,
              track views, sales, and payouts in a simple dashboard.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <h3 className="font-semibold">Secure & Smooth</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Google sign-in, Firestore + Storage, and server-verified payments
              give a reliable, fraud-resistant marketplace flow.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold">
                Ready to discover your next hero image?
              </h3>
              <p className="text-brand-100">
                Explore curated photos from independent creators.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-brand-700 font-medium hover:bg-brand-50 transition"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
