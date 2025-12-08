// src/pages/Home.jsx
import React from "react";

const heroImages = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
        {/* LEFT: TEXT */}
        <section className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-violet-500">
            Sell once • Earn many times
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Turn your photos into
            <br />
            income.
          </h1>

          <p className="mt-4 text-slate-600 max-w-xl text-sm md:text-base">
            Architects, designers, bloggers, marketing agencies and businesses
            buy licensed images from Picsellart. You upload once — we handle
            secure checkout and instant downloads.
          </p>

          <ul className="mt-5 space-y-2 text-sm text-slate-700">
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
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Buyer Login
            </a>
            <a
              href="/seller-login"
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white shadow-md hover:opacity-95"
            >
              Become a Seller
            </a>
            <a
              href="/explore"
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Explore Pictures
            </a>
          </div>
        </section>

        {/* RIGHT: IMAGE COLLAGE */}
        <section className="flex-1 w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 rounded-3xl overflow-hidden shadow-sm h-52 md:h-64">
              <img
                src={heroImages[0]}
                alt="Picsellart preview 1"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-sm h-40 md:h-48">
              <img
                src={heroImages[1]}
                alt="Picsellart preview 2"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-sm h-40 md:h-48">
              <img
                src={heroImages[2]}
                alt="Picsellart preview 3"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
