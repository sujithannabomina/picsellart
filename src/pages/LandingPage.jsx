import { Link } from "react-router-dom";
import { useMemo } from "react";

const HERO_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function pickRandomUnique(arr, count) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export default function LandingPage() {
  // Pick 3 different images on first render/refresh
  const featured = useMemo(() => pickRandomUnique(HERO_IMAGES, 3), []);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-medium text-slate-900">
            Turn your photos into income
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-slate-600">
            Join our marketplace where photographers, designers, and creators monetize their work.
            Buyers get instant access to unique, premium images for their projects.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/seller/start"
              className="btn btn-primary"
              aria-label="Become a Seller"
            >
              Become a Seller
            </Link>
            <Link
              to="/explore"
              className="btn btn-secondary"
              aria-label="Explore Photos"
            >
              Explore Photos
            </Link>
            <Link
              to="/buyer/login"
              className="btn btn-secondary"
              aria-label="Buyer Login"
            >
              Buyer Login
            </Link>
            <Link
              to="/seller/login"
              className="btn btn-secondary"
              aria-label="Seller Login"
            >
              Seller Login
            </Link>
          </div>
        </div>

        {/* Featured strip (random 3) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((src, idx) => (
            <Link
              to="/explore"
              key={src}
              className="group block overflow-hidden rounded-2xl ring-1 ring-slate-200/70 hover:ring-slate-300 transition"
            >
              <div className="aspect-[4/3] bg-slate-100 relative">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img
                  src={src}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                />
              </div>
              <div className="p-3 text-sm text-slate-600">
                Curated from our sample gallery
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value props (simple, sleek) */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Upload & Earn">
            Set your price and start selling. We handle delivery & licensing.
          </Card>
          <Card title="Fast Checkout">
            Buyers pay securely and receive instant download links.
          </Card>
          <Card title="Creator Friendly">
            Transparent terms and easy payouts for creators.
          </Card>
        </div>
      </section>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{children}</p>
    </div>
  );
}
