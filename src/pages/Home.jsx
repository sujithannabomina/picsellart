// src/pages/Home.jsx
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col md:flex-row items-center gap-10">
        {/* Left text block */}
        <div className="w-full md:w-1/2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-purple-500 mb-3">
            Sell once • Earn many times
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Turn your photos into income.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl">
            Architects, designers, bloggers, marketing agencies and businesses
            buy licensed images from Picsellart. You upload once — we handle
            secure checkout and instant downloads.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-slate-700">
            <li>• Set your own price within your selected seller plan.</li>
            <li>
              • Picsellart watermark on previews — clean, full-resolution file
              after purchase.
            </li>
            <li>• Track views, sales and earnings from your dashboard.</li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/buyer-login"
              className="px-5 py-2.5 rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition"
            >
              Buyer Login
            </a>
            <a
              href="/seller-login"
              className="px-5 py-2.5 rounded-full bg-purple-600 text-sm font-medium text-white shadow-lg shadow-purple-300 hover:bg-purple-700 active:scale-[0.98] transition"
            >
              Become a Seller
            </a>
            <a
              href="/explore"
              className="px-5 py-2.5 rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition"
            >
              Explore Pictures
            </a>
          </div>
        </div>

        {/* Right image grid – uses 4 local sample images */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="rounded-3xl overflow-hidden shadow-md shadow-slate-200">
              <img
                src="/images/sample1.jpg"
                alt="Sample 1"
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-md shadow-slate-200">
              <img
                src="/images/sample2.jpg"
                alt="Sample 2"
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-md shadow-slate-200">
              <img
                src="/images/sample3.jpg"
                alt="Sample 3"
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-md shadow-slate-200">
              <img
                src="/images/sample4.jpg"
                alt="Sample 4"
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
