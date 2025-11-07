// src/pages/LandingPage.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";

const localImages = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

export default function LandingPage() {
  const [src, setSrc] = useState(localImages[0]);

  useEffect(() => {
    const i = Math.floor(Math.random() * localImages.length);
    setSrc(localImages[i]);
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl overflow-hidden border">
          <img src={src} alt="Hero" className="w-full h-auto block" />
        </div>

        <h1 className="mt-8 text-5xl font-extrabold text-slate-900 tracking-tight">
          Turn your Images into Income
        </h1>
        <p className="mt-3 text-slate-700">
          Upload your Photos, designs, or creative content and start selling to designers,
          architects and creators today. | <strong>Secure Payments</strong> |{" "}
          <strong>Verified Sellers</strong> | <strong>Instant Downloads</strong> |
        </p>

        <div className="mt-6 flex gap-3">
          <a
            href="/seller"
            className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            Seller Login
          </a>
          <a
            href="/buyer"
            className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Buyer Login
          </a>
          <a
            href="/explore"
            className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800"
          >
            Explore Photos
          </a>
        </div>
      </main>
    </>
  );
}
