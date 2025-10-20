// src/components/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage(){
  return (
    <section>
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h1>Turn Your Photos into Income</h1>
          <p>
            Join our marketplace where photographers, designers, and creators monetize
            their work. Buyers get instant access to unique, premium images for projects.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/seller/login" className="btn">Become a Seller</Link>
            <Link to="/explore" className="btn btn--ghost">Explore Photos</Link>
          </div>
        </div>

        {/* Static showreel using your public/ images that rotate on refresh */}
        <LandingShowreel />
      </div>
    </section>
  );
}

const picks = [1,2,3,4,5,6];
function LandingShowreel(){
  // rotate which 3 we show on each refresh
  const seed = Math.floor(Math.random()*picks.length);
  const trio = [picks[seed%6], picks[(seed+1)%6], picks[(seed+2)%6]];
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-10">
      {trio.map((n)=>(
        <div key={n} className="card overflow-hidden h-[320px]">
          <img
            className="w-full h-full object-cover"
            src={`/images/sample${n}.jpg`}
            alt={`Showcase ${n}`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
