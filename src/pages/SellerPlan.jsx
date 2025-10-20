// src/pages/SellerPlan.jsx
export default function SellerPlan(){
  const plans = [
    { id:"starter", name:"Starter", price:100, upload:25, max:199 },
    { id:"pro",     name:"Pro",     price:300, upload:30, max:249 },
    { id:"elite",   name:"Elite",   price:800, upload:50, max:249 },
  ];

  const pay = async (plan) => {
    const res = await fetch("/api/createOrder?mode=seller",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        itemId:`seller-plan-${plan.id}`,
        amount: plan.price * 100,
        currency:"INR",
        title:`Seller ${plan.name} Plan`,
        source:"seller-plan"
      })
    });
    const order = await res.json();
    if(!res.ok){ alert("Payment failed"); return; }

    const script = document.createElement("script");
    script.src="https://checkout.razorpay.com/v1/checkout.js";
    script.onload = ()=>{
      const rp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Picsellart",
        description: `Seller ${plan.name} Plan`,
        order_id: order.id,
        handler: ()=> alert("Payment successful!")
      });
      rp.open();
    };
    document.body.appendChild(script);
  };

  return (
    <div className="container">
      <h1 className="h1">Choose Your Seller Pack</h1>
      <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
        {plans.map(p=>(
          <div key={p.id} className="card">
            <div className="cardBody">
              <div className="title" style={{fontSize:18}}>{p.name}</div>
              <div className="price" style={{fontSize:28, margin:"6px 0"}}>₹{p.price}</div>
              <ul className="muted" style={{paddingLeft:18, margin:"8px 0 16px"}}>
                <li>Upload limit: {p.upload} images</li>
                <li>Max price per image: ₹{p.max}</li>
              </ul>
              <button className="btn" onClick={()=>pay(p)}>Pay</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
