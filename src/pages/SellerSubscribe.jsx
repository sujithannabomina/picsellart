import ProtectedRoute from "../components/ProtectedRoute";

export default function SellerSubscribe(){
  const start = async () => {
    const res = await fetch("/api/razorpay/create-order", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ amount: 49900, currency: "INR", notes:{plan:"seller_basic"} })
    }).then(r=>r.json());
    const rz = await import("../utils/razorpay");
    await rz.openCheckout({
      order_id: res.id,
      amount: res.amount,
      name: "Picsellart Seller Plan",
      description: "6-month listing",
      notes: { plan: "seller_basic"}
    });
  };

  return (
    <ProtectedRoute need="seller">
      <div className="container">
        <h1>Activate Seller Plan</h1>
        <p>₹499 one-time for 6 months.</p>
        <button className="pill blue" onClick={start}>Pay ₹499</button>
      </div>
    </ProtectedRoute>
  );
}
