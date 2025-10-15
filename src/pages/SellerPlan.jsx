import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthProvider";
import { PRICE_PLANS } from "../utils/plans";
import { openRazorpay } from "../utils/razorpay";
import { useEffect, useState } from "react";

function Content(){
  const { profile, setProfile, user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(()=>{ if (profile?.plan) window.location.replace("/seller/dashboard"); }, [profile]);

  const buy = async (plan) => {
    try {
      setErr(""); setBusy(true);
      const res = await fetch("/api/createOrder", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ planId: plan.id })});
      const order = await res.json(); // {orderId, amount, planId, planName}
      const payment = await openRazorpay(order);
      const verify = await fetch("/api/verifyPayment", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ ...payment, planId: plan.id, uid: user.uid, email: user.email })
      });
      const ok = await verify.json();
      if (ok?.status === "active") { setProfile({ ...profile, plan }); window.location.replace("/seller/dashboard"); }
      else setErr("Payment verification failed.");
    } catch (e){ setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-8">Choose Your Seller Plan</h2>
      {err && <p className="text-red-600 mb-4">{err}</p>}
      <div className="grid md:grid-cols-3 gap-6">
        {PRICE_PLANS.map(p=>(
          <div key={p.id} className="border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
            <p className="text-3xl font-bold mb-2">₹{p.priceINR}</p>
            <ul className="text-sm text-gray-600 mb-4 list-disc ml-5">
              <li>Max Image Price: ₹{p.maxPricePerPhoto}</li>
              <li>Upload limit: {p.uploadLimit} photos</li>
            </ul>
            <button className="btn btn-primary w-full" disabled={busy} onClick={()=>buy(p)}>
              {busy ? "Processing..." : "Buy Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function SellerPlan(){
  return <ProtectedRoute requireRole="seller"><Content/></ProtectedRoute>;
}
