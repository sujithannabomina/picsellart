// /src/pages/LandingPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const PUBLIC_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function pickThree(arr) {
  // rotate on each refresh: random 3 distinct images
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export default function LandingPage() {
  const navigate = useNavigate();
  const picks = useMemo(() => pickThree(PUBLIC_IMAGES), []);

  return (
    <main className="px-6 md:px-12 lg:px-20 py-12">
      <section className="max-w-5xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Turn your Images into Income
        </h1>

        <p className="mt-5 text-lg text-slate-700 max-w-3xl">
          Upload your Photos, designs, or creative content and start selling to designers,
          architects and creators today. | <b>Secure Payments</b> | <b>Verified Sellers</b> | <b>Instant Downloads</b> |
        </p>

        <div className="mt-6 flex gap-3">
          <button onClick={() => navigate("/start-selling")} className="btn-primary">
            Start Selling
          </button>
          <Link to="/explore" className="btn-outline">Explore Photos</Link>
        </div>
      </section>

      <section className="mt-10 flex gap-6">
        {picks.map((src) => (
          <img
            key={src}
            src={src}
            alt="sample"
            className="h-56 w-44 md:h-64 md:w-56 lg:h-72 lg:w-64 rounded-xl object-cover shadow"
            loading="eager"
          />
        ))}
      </section>
    </main>
  );
}
