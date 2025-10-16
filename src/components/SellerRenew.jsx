// src/pages/SellerRenew.jsx
import { createOrder } from "../lib/payments";
import { PLANS } from "../utils/plans";

export default function SellerRenew(){
  const renew = async (planId) => {
    const selected = PLANS[planId];
    try{
      await createOrder({ planId, amount: selected.price });
      // server will extend 180 days from now; UI purposely does not show the days
      window.location.href = "/seller/dashboard";
    }catch(e){
      alert("Payment failed. Please try again.");
      console.error(e);
    }
  };

  return (
    <main className="container">
      <h1 className="h1">Renew Your Seller Pack</h1>
      <div className="grid cols-3" style={{marginTop:18}}>
        <RenewCard title="Starter" price="₹100" bullets={["Upload up to 25 images","Max price per image ₹199"]} onClick={()=>renew("starter")}/>
        <RenewCard title="Pro"     price="₹300" bullets={["Upload up to 30 images","Max price per image ₹249"]} onClick={()=>renew("pro")}/>
        <RenewCard title="Elite"   price="₹800" bullets={["Upload up to 50 images","Max price per image ₹249"]} onClick={()=>renew("elite")}/>
      </div>
    </main>
  );
}

function RenewCard({title, price, bullets, onClick}){
  return (
    <div className="card" style={{textAlign:"center"}}>
      <div style={{fontWeight:800, fontSize:18, marginBottom:6}}>{title}</div>
      <div style={{fontSize:28, fontWeight:800, marginBottom:12}}>{price}</div>
      <ul className="subtle" style={{textAlign:"left", display:"inline-block", margin:"0 0 16px 0", padding:"0 0 0 18px"}}>
        {bullets.map((b,i)=><li key={i} style={{marginBottom:6}}>{b}</li>)}
      </ul>
      <button className="btn block" onClick={onClick}>Renew</button>
    </div>
  );
}
