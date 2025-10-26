import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

/**
 * Landing hero with rotating, deterministic sample images (your requirement)
 * – pulls from /public/images or uses the same 3 keys shuffled per page load.
 */
const SAMPLE_POOL = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];
function pick3(pool) {
  const copy = [...pool];
  // Lightweight shuffle for variety without external deps
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 3);
}

export default function LandingPage() {
  const navigate = useNavigate();
  const picks = useMemo(() => pick3(SAMPLE_POOL), []);

  return (
    <main>
      <section className="container hero">
        <h1>Turn your Images into Income</h1>

        <p className="m-0">
          Upload your Photos, designs, or creative content and start selling to
          designers, architects and creators today.
          <span className="link-pill"> | Secure Payments | Verified Sellers | Instant Downloads |</span>
        </p>

        <div className="actions">
          <button className="primary btn" onClick={() => navigate("/seller/subscribe")}>
            Start Selling
          </button>
          <Link to="/explore" className="ghost btn" aria-label="Explore Photos">
            Explore Photos
          </Link>
        </div>

        <p className="muted mt-2">Secure • Fast Payouts • Simple Setup</p>

        <div className="gallery" aria-label="Sample marketplace photos">
          {picks.map((src, i) => (
            <figure key={src} className="card-img">
              <img src={src} alt={`Sample ${i + 1}`} loading="eager" />
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
