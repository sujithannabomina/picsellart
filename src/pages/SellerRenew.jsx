import { PRICE_PLANS } from "../utils/plans";
import { useAuth } from "../context/AuthProvider";

export default function SellerRenew() {
  const { user } = useAuth();

  const buyPack = async (plan) => {
    const res = await fetch("/api/createPackOrder", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ packId: plan.id })
    });
    const order = await res.json();

    const rzp = new window.Razorpay({
      key: window.__RZP_PHOTO_KEY__ || import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount, currency: "INR",
      name: "Picsellart",
      description: plan.name,
      order_id: order.orderId,
      handler: async (response) => {
        const verify = await fetch("/api/verifyPackPayment", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ ...response, packId: plan.id, uid: user.uid, email: user.email })
        });
        const ok = await verify.json();
        if(ok.status==="activated"){ alert("Pack renewed!"); window.location.href="/seller/dashboard"; }
        else alert("Payment verification failed.");
      }
    });
    rzp.open();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 my-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Renew Your Seller Pack</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {PRICE_PLANS.map(p => (
          <div key={p.id} className="card text-center">
            <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
            <p className="text-2xl font-bold mb-4">₹{p.packPrice}</p>
            <p className="text-sm text-gray-500 mb-4">Access for 180 days</p>
            <button className="btn btn-primary" onClick={()=>buyPack(p)}>Renew</button>
          </div>
        ))}
      </div>
    </div>
  );
}
