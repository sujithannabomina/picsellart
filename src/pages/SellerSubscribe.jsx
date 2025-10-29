import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { plans } from "../utils/plans";
import { loadRazorpay } from "../utils/loadRazorpay";
import { useAuth } from "../context/AuthContext";

export default function SellerSubscribe() {
  const { setSellerHasActivePlan } = useAuth();
  const [busy, setBusy] = useState(false);

  const pay = async (plan) => {
    setBusy(true);
    try {
      await loadRazorpay();
      // create order on server
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, amount: plan.amount }),
      });
      const data = await res.json();
      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        order_id: data.orderId,
        name: "Picsellart Seller Plan",
        description: plan.name,
        handler: async (response) => {
          // Verify on server
          await fetch("/api/verifyPayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ razorpay: response, planId: plan.id }),
          });
          setSellerHasActivePlan(true);
          window.location.href = "/seller/dashboard";
        }
      };
      new window.Razorpay(options).open();
    } finally {
      setBusy(false);
    }
  };

  const Content = () => (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Choose a Seller Plan</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="card">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm opacity-70 mb-2">{p.description}</div>
            <div className="text-xl font-bold mb-3">₹{p.amount/100}</div>
            <button className="btn btn-primary" onClick={() => pay(p)} disabled={busy}>Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ProtectedRoute mustBeSeller>
      <Content />
    </ProtectedRoute>
  );
}
