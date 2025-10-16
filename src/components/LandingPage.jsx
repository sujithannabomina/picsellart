// src/components/LandingPage.jsx
import { Link } from "react-router-dom";

const samples = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function pick(n) {
  const copy = [...samples];
  const out = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

export default function LandingPage() {
  const picks = pick(3);
  return (
    <main className="landing">
      <h1 className="title">Picsellart</h1>
      <p className="tagline">
        Turn your photos into income. Sellers upload and earn; buyers get
        licensed, instant downloads.
      </p>
      <div className="cta-row">
        <Link to="/buyer/login" className="btn ghost">Buyer Login</Link>
        <Link to="/seller/login" className="btn primary">Become a Seller</Link>
        <Link to="/explore" className="btn ghost">Explore Pictures</Link>
      </div>

      <section className="showcase">
        {picks.map((src) => (
          <figure key={src} className="card">
            <img src={src} alt="Showcase" loading="lazy" />
            <figcaption>Showcase</figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}
