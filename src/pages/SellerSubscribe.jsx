// src/pages/SellerSubscribe.jsx
import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { plans } from "../utils/plans";
import { loadRazorpay } from "../utils/loadRazorpay";
import { useAuth } from "../context/AuthContext";

export default function SellerSubscribe() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function checkout(planId) {
    try {
      setLoading(true);
      const Razorpay = await loadRazorpay();

      // Create order via your Vercel serverless function (already in /api)
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const { order, keyId } = await res.json();

      const rzp = new Razorpay({
        key: keyId,
        order_id: order.id,
        name: "Picsellart",
        description: `Plan: ${planId}`,
        handler: async (resp) => {
          // You already have verify endpoints in /api
          await fetch("/api/verifyPayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...resp, planId }),
          });
          alert("Payment successful!");
        },
        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
        },
        theme: { color: "#111827" },
      });

      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Unable to start checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Choose your Seller Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className="border rounded-xl p-4">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-gray-600 mt-1">{p.uploads} uploads • Max ₹{p.maxPrice}</p>
              <p className="text-lg font-bold mt-2">₹{p.price}</p>
              <button
                className="mt-4 w-full rounded bg-black text-white py-2 disabled:opacity-50"
                onClick={() => checkout(p.id)}
                disabled={loading}
              >
                {loading ? "Processing…" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </ProtectedRoute>
  );
}
