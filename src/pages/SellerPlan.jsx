import { PLANS } from "../utils/plans"; // keep your existing PLANS
import { Link } from "react-router-dom";

export default function SellerPlan() {
  return (
    <main className="container page">
      <h1>Choose Your Seller Pack</h1>
      <div className="plans">
        {PLANS.map((p) => (
          <article key={p.id} className="plan">
            <h3>{p.name}</h3>
            <div style={{fontSize:24, fontWeight:800, marginBottom:8}}>₹{p.price}</div>
            <ul className="bullets">
              <li>Upload limit: {p.maxUploads} images</li>
              <li>Max price per image: ₹{p.maxPrice}</li>
            </ul>
            <div style={{marginTop:12}}>
              <Link className="btn btn-primary" to={`/seller/renew?plan=${p.id}`}>Buy</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
