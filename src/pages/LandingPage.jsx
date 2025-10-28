import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PUBLIC_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

export default function LandingPage() {
  // pick 3 random images on each visit/refresh
  const picks = useMemo(() => {
    const pool = [...PUBLIC_IMAGES];
    const out = [];
    while (out.length < 3 && pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      out.push(pool.splice(i, 1)[0]);
    }
    return out;
  }, []);

  // pre-load for smoothness
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let loaded = 0;
    picks.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded += 1;
        if (loaded >= picks.length) setReady(true);
      };
      img.src = src;
    });
  }, [picks]);

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
            Turn your Images into Income
          </h1>
          <p className="mt-4 text-slate-600 max-w-xl">
            Upload your Photos, designs, or creative content and start selling to
            designers, architects and creators today. | <b>Secure Payments</b> |
            <b> Verified Sellers</b> | <b>Instant Downloads</b> |
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Link
              to="/seller"
              className="rounded-full bg-blue-600 text-white px-5 py-2 shadow hover:bg-blue-700"
            >
              Start Selling
            </Link>
            <Link
              to="/explore"
              className="rounded-full border border-slate-300 px-5 py-2 hover:border-slate-400"
            >
              Explore Photos
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6 justify-center md:justify-end">
          {picks.map((src) => (
            <div
              key={src}
              className="w-56 h-72 rounded-2xl overflow-hidden shadow-md bg-slate-100"
            >
              {/* fade in once loaded */}
              <img
                src={src}
                alt="sample"
                className={`w-full h-full object-cover transition-opacity duration-700 ${
                  ready ? "opacity-100" : "opacity-0"
                }`}
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
