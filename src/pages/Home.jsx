// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="grid gap-10 md:grid-cols-2 md:items-center">
      {/* Left: text content */}
      <div className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-purple-500">
          Verified Sellers · Instant Downloads · Secure Payments
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Discover Stunning Visuals From Talented Creators
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-slate-600">
          Browse premium high-quality images uploaded by creators across India.
          Buy and download instantly with full commercial rights after secure
          Razorpay checkout.
        </p>

        <ul className="space-y-2 text-sm text-slate-700">
          <li>• Set your own price within your plan limits.</li>
          <li>• Picsellart watermark on previews – clean file after purchase.</li>
          <li>• Track views, sales and earnings from your dashboard.</li>
        </ul>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            to="/explore"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800"
          >
            Explore Photos
          </Link>
          <Link
            to="/seller-login"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Sell Your Photos
          </Link>
        </div>
      </div>

      {/* Right: hero preview card */}
      <div className="hidden md:flex justify-end">
        <div className="relative w-full max-w-md rounded-3xl bg-white p-4 shadow-xl">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
            <img
              src="/images/sample3.jpg"
              alt="Sample Picsellart preview"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Street Photography
              </p>
              <p className="text-xs text-slate-500">Watermarked preview</p>
            </div>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              ₹399 – ₹799
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
