// src/pages/SellerPlan.jsx
import { useNavigate } from "react-router-dom";
import { createOrder } from "../lib/payments"; // your Razorpay flow wrapper
import { PLANS } from "../utils/plans";       // already updated to 100/300/800 & limits

export default function SellerPlan(){
  const navigate = useNavigate();

  const subscribe = async (planId) => {
    try{
      const selected = PLANS[planId];
      await createOrder({ planId, amount: selected.price }); // continues to Razorpay
      // after success, your payment verifier should set seller pack & expiry in Firestore
      navigate("/seller/dashboard", { replace:true });
    }catch(e){
      alert("Payment failed. Please try again.");
      console.error(e);
    }
  };

  return (
    <main className="container">
      <h1 className="h1">Choose Your Seller Pack</h1>
      <p className="subtle" style={{marginBottom:24}}>
        Pick a pack to unlock uploads. Limits are enforced automatically.
      </p>

      <div className="grid cols-3">
        <PlanCard
          title="Starter"
          price="₹100"
          bullets={[
            "Upload up to 25 images",
            "Max price per image ₹199",
          ]}
          onClick={()=>subscribe("starter")}
        />
        <PlanCard
          title="Pro"
          price="₹300"
          bullets={[
            "Upload up to 30 images",
            "Max price per image ₹249",
          ]}
          onClick={()=>subscribe("pro")}
        />
        <PlanCard
          title="Elite"
          price="₹800"
          bullets={[
            "Upload up to 50 images",
            "Max price per image ₹249",
          ]}
          onClick={()=>subscribe("elite")}
        />
      </div>
    </main>
  );
}

function PlanCard({title, price, bullets, onClick}){
  return (
    <div className="card" style={{textAlign:"center"}}>
      <div style={{fontWeight:800, fontSize:18, marginBottom:6}}>{title}</div>
      <div style={{fontSize:28, fontWeight:800, marginBottom:12}}>{price}</div>
      <ul className="subtle" style={{textAlign:"left", display:"inline-block", margin:"0 0 16px 0", padding:"0 0 0 18px"}}>
        {bullets.map((b,i)=><li key={i} style={{marginBottom:6}}>{b}</li>)}
      </ul>
      <button className="btn block" onClick={onClick}>Continue</button>
    </div>
  );
}
