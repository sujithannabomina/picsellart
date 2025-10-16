import { Link } from "react-router-dom";

const picks = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
];

export default function LandingPage() {
  return (
    <>
      <section className="hero container">
        <h1>Turn Your Photos into Income</h1>
        <p>
          Join our marketplace where photographers, designers, and creators monetize their work.
          Buyers get instant access to unique, premium images for their projects.
        </p>
        <div className="hero-actions">
          <Link to="/seller/login" className="btn btn-primary">Become a Seller</Link>
          <Link to="/explore" className="btn">Explore Photos</Link>
        </div>
      </section>

      <section className="container showcase" aria-label="Showcase">
        {picks.map((src) => (
          <div className="card" key={src}>
            <img src={src} alt="Showcase" loading="lazy" />
          </div>
        ))}
      </section>
    </>
  );
}
