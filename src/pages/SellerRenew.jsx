import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PLANS } from "../utils/plans";

export default function SellerRenew(){
  const [sp] = useSearchParams();
  const pick = sp.get("plan");
  const plan = useMemo(() => PLANS.find(p => String(p.id) === String(pick)) ?? PLANS[0], [pick]);

  return (
    <main className="container page">
      <h1>Renew Your Seller Pack</h1>
      <div className="plans">
        {PLANS.map((p) => (
          <article key={p.id} className="plan" style={{outline: p.id===plan.id?`2px solid var(--brand)`:"none"}}>
            <h3>{p.name}</h3>
            <div style={{fontSize:24, fontWeight:800, marginBottom:8}}>₹{p.price}</div>
            <ul className="bullets">
              <li>Upload limit: {p.maxUploads} images</li>
              <li>Max price per image: ₹{p.maxPrice}</li>
            </ul>
            <div style={{marginTop:12}}>
              <a className="btn btn-primary" href={`/api/createPackOrder?plan=${p.id}`}>Buy</a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
