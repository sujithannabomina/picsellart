// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Discover Stunning Visuals From Talented Creators
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Browse premium high-quality images uploaded by creators across India.  
            Buy and download instantly with full commercial rights.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate("/explore")}
              className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/40 transition hover:brightness-105"
            >
              Explore Images
            </button>

            <button
              onClick={() => navigate("/seller-login")}
              className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Sell Your Photos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
