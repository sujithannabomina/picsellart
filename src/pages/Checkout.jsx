// src/pages/Checkout.jsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Checkout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const item = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("psa:selectedItem");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [id]);

  if (!user) {
    // if someone directly came here, force buyer login
    sessionStorage.setItem("psa:returnTo", `/checkout/${encodeURIComponent(id)}`);
    navigate("/buyer-login");
    return null;
  }

  if (!item) {
    return (
      <main className="page">
        <h1>Checkout</h1>
        <p className="muted">We couldn’t load this item. Please return to Explore and click Buy again.</p>
        <button className="btn btn-primary" onClick={() => navigate("/explore")}>
          Back to Explore
        </button>
      </main>
    );
  }

  async function payNow() {
    setErr("");
    setBusy(true);

    // ✅ For now: safe placeholder (does NOT break your site)
    // Next step: connect /api/create-order and open Razorpay checkout smoothly.
    try {
      alert("Razorpay checkout will be connected next (webhook + verification).");
    } catch (e) {
      setErr("Payment could not start. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <section className="page-head">
        <h1>Checkout</h1>
        <p className="muted">
          You are purchasing: <b>{item.title}</b>
        </p>
      </section>

      <section className="checkout">
        <div className="checkout-card">
          <img src={item.imageUrl} alt={item.title} />
        </div>

        <div className="checkout-bar">
          <div className="price">Total: ₹{item.price}</div>
          <div className="muted" style={{ marginLeft: "auto" }}>
            {item.license || "Standard digital license"}
          </div>
        </div>

        <div className="checkout-actions">
          <button className="btn btn-small" onClick={() => navigate(-1)}>
            Back
          </button>
          <button className="btn btn-small btn-primary" disabled={busy} onClick={payNow}>
            {busy ? "Starting…" : "Pay with Razorpay"}
          </button>
        </div>

        {err ? <div className="auth-error" style={{ marginTop: 10 }}>{err}</div> : null}
      </section>
    </main>
  );
}
