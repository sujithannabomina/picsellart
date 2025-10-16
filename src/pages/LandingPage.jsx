// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

const homeImages = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
];

export default function LandingPage(){
  return (
    <main>
      <section className="container" style={{textAlign:"center", paddingTop: 24}}>
        <h1 className="h1" style={{marginBottom: 10}}>Picsellart</h1>
        <p className="subtle" style={{maxWidth: 760, margin:"0 auto 16px"}}>
          Turn your photos into income. Sellers upload and earn; buyers get licensed, instant downloads.
        </p>
        <div style={{display:"flex", gap:14, justifyContent:"center", marginBottom: 24, flexWrap:"wrap"}}>
          <Link className="btn outline" to="/buyer/login">Buyer Login</Link>
          <Link className="btn" to="/seller/login">Become a Seller</Link>
          <Link className="btn outline" to="/explore">Explore Pictures</Link>
        </div>

        <div className="grid cols-3">
          {homeImages.map((src,i)=>(
            <div className="tile" key={i}>
              <img src={src} alt="Showcase" loading="lazy"/>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
