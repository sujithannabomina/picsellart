// File: src/pages/LandingPage.jsx

import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const HERO_IMAGES = [
  "/landing/hero1.jpg",
  "/landing/hero2.jpg",
  "/landing/hero3.jpg",
  "/landing/hero4.jpg",
  "/landing/hero5.jpg",
  "/landing/hero6.jpg",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function LandingPage() {
  // ✅ rotates on every refresh + every new visit (component mount)
  const heroImage = useMemo(() => pickRandom(HERO_IMAGES), []);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Buy licensed images • Sell and earn
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                PicSellArt — Buy & Sell Stunning Photos
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                A clean marketplace for designers, architects, bloggers, agencies and businesses.
                Preview with watermark, purchase securely, and download instantly.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/explore"
                  className="rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-purple-700"
                >
                  Explore Pictures
                </Link>

                <Link
                  to="/buyer-login"
                  className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                  Buyer Login
                </Link>

                <Link
                  to="/seller-login"
                  className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                  Seller Login
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-900">Watermarked preview</p>
                  <p className="mt-1 text-sm text-slate-600">Clean file after purchase</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-900">Instant access</p>
                  <p className="mt-1 text-sm text-slate-600">Download from dashboard</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-900">Sell once</p>
                  <p className="mt-1 text-sm text-slate-600">Earn multiple times</p>
                </div>
              </div>
            </div>

            {/* Right image card */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-lg">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={heroImage}
                    alt="Featured preview"
                    className="h-[360px] w-full object-cover md:h-[420px]"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-2xl bg-white/90 p-4 backdrop-blur">
                      <p className="text-sm font-medium text-slate-900">
                        Rotating featured image
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Changes on every refresh / new visit
                      </p>
                    </div>
                  </div>
                </div>

                {/* mini preview row */}
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[HERO_IMAGES[0], HERO_IMAGES[1], HERO_IMAGES[2]].map((src, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-slate-200">
                      <img src={src} alt={`Preview ${i + 1}`} className="h-20 w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-200 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-sky-200 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-purple-700">1) Explore</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Find the right photo</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Browse sample gallery and verified sellers. Use search and pagination.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-purple-700">2) Purchase</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Pay securely</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Buy using Razorpay checkout and access downloads in your dashboard.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-purple-700">3) Download</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Get clean files</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Watermark disappears after purchase. Download original in buyer dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
