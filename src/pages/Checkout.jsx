import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

function priceFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return 151 + (hash % 49);
}

function CheckoutInner() {
  const { fileName } = useParams();
  const decoded = decodeURIComponent(fileName || "");
  const nav = useNavigate();

  const price = useMemo(() => priceFromName(decoded), [decoded]);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setErr("");
  }, [decoded]);

  const payNow = async () => {
    setErr("");
    setBusy(true);
    try {
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Missing VITE_RAZORPAY_KEY_ID");

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInPaise: price * 100,
          currency: "INR",
          receipt: `photo_${decoded}_${Date.now()}`,
          notes: { fileName: decoded },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create order");

      const options = {
        key,
        amount: data.amount,
        currency: data.currency,
        name: "Picsellart",
        description: `Purchase: ${decoded}`,
        order_id: data.id,
        handler: async function (response) {
          // Verify signature on server
          const vr = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              fileName: decoded,
              amountInPaise: price * 100,
            }),
          });

          const vdata = await vr.json();
          if (!vr.ok || !vdata.ok) {
            setErr(vdata?.error || "Payment verification failed.");
            return;
          }

          // Success → go to buyer dashboard (later we’ll add real download delivery)
          nav("/buyer-dashboard", { replace: true });
        },
        theme: { color: "#6d28d9" },
      };

      if (!window.Razorpay) throw new Error("Razorpay script not loaded.");

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setErr(e?.message || "Payment failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-semibold">Checkout</h1>
      <p className="mt-2 text-black/70">
        You are purchasing: <span className="font-medium">Street Photography</span>
      </p>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-black/60">{decoded}</div>
          <div className="font-semibold">Total: ₹{price}</div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="px-5 py-2 rounded-full border border-black/10 text-sm hover:bg-black/5"
          >
            Back
          </button>
          <button
            type="button"
            onClick={payNow}
            disabled={busy}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm shadow hover:opacity-95 disabled:opacity-60"
          >
            {busy ? "Opening Razorpay..." : "Pay with Razorpay"}
          </button>
        </div>

        {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}

        <p className="mt-3 text-xs text-black/50">
          Next step (production): after verification, deliver a secure download link for the original file.
        </p>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <ProtectedRoute role="buyer">
      <CheckoutInner />
    </ProtectedRoute>
  );
}
