// FILE: src/pages/SellerLogin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext.jsx";
import { PLANS, formatINR } from "../utils/plans.js";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { openRazorpayCheckout } from "../lib/razorpay.js";

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function SellerLogin() {
  const nav = useNavigate();
  const { signIn, user, userDoc, refreshUserDoc } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [paying, setPaying] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    fullName: userDoc?.sellerProfile?.fullName || userDoc?.displayName || "",
    phone: userDoc?.sellerProfile?.phone || "",
    upi: userDoc?.sellerProfile?.upi || "",
  });

  const [planDoc, setPlanDoc] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      if (!user) {
        setPlanDoc(null);
        setPlanLoading(false);
        return;
      }
      setPlanLoading(true);
      const snap = await getDoc(doc(db, "sellerPlans", user.uid));
      setPlanDoc(snap.exists() ? snap.data() : null);
      setPlanLoading(false);
    }
    loadPlan();
  }, [user]);

  const planIsActive = useMemo(() => {
    if (!planDoc || planDoc.status !== "active" || !planDoc.endAt) return false;
    const end = planDoc.endAt?.toDate ? planDoc.endAt.toDate() : new Date(planDoc.endAt);
    return end.getTime() > Date.now();
  }, [planDoc]);

  const needsProfile = useMemo(() => {
    if (!user) return true;
    const p = userDoc?.sellerProfile;
    return !p || !p.fullName || !p.phone || !p.upi;
  }, [user, userDoc]);

  async function handleGoogle() {
    await signIn("seller");
    await refreshUserDoc();
  }

  async function purchasePlan() {
    if (!user) return;
    const plan = PLANS[selectedPlan];
    if (!plan) return;

    setPaying(true);
    try {
      // Create order on server
      const resp = await fetch(`/api/razorpay?action=createOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price * 100,
          currency: "INR",
          receipt: `sellerplan_${user.uid}_${Date.now()}`,
          notes: { uid: user.uid, planId: plan.id, type: "seller_plan" },
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error ? JSON.stringify(data.error) : "Order create failed");
      const order = data.order;

      // Checkout
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Missing VITE_RAZORPAY_KEY_ID in Vercel env vars");

      const payRes = await openRazorpayCheckout({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "PicSellart",
        description: `Seller Plan: ${plan.name}`,
        order_id: order.id,
        prefill: { email: user.email || "", name: user.displayName || "" },
        notes: { planId: plan.id, uid: user.uid },
        theme: { color: "#7c3aed" },
      });

      // Verify
      const v = await fetch(`/api/razorpay?action=verifyPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payRes),
      });
      const vData = await v.json();
      if (!v.ok || !vData.verified) throw new Error("Payment verification failed");

      // Save plan doc
      const start = new Date();
      const end = addDays(start, plan.durationDays);

      await setDoc(
        doc(db, "sellerPlans", user.uid),
        {
          uid: user.uid,
          planId: plan.id,
          planName: plan.name,
          status: "active",
          startAt: start,
          endAt: end,
          durationDays: plan.durationDays,
          maxUploads: plan.maxUploads,
          maxPrice: plan.maxPrice,
          payment: {
            orderId: order.id,
            paymentId: payRes.razorpay_payment_id,
            signature: payRes.razorpay_signature,
            amount: order.amount,
            currency: order.currency,
            at: serverTimestamp(),
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const snap = await getDoc(doc(db, "sellerPlans", user.uid));
      setPlanDoc(snap.exists() ? snap.data() : null);
    } catch (e) {
      alert(e.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          role: "seller",
          sellerProfile: {
            fullName: profile.fullName.trim(),
            phone: profile.phone.trim(),
            upi: profile.upi.trim(),
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await refreshUserDoc();
      nav("/seller-dashboard", { replace: true });
    } catch (e) {
      alert(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "36px 18px 60px" }}>
      <h1 style={{ fontSize: 34, margin: 0, fontWeight: 800, color: "#111" }}>Seller Login</h1>
      <p style={{ color: "#555", marginTop: 10, lineHeight: 1.6 }}>
        Sellers must have an active subscription plan. After purchase, complete your profile (UPI + phone) to enable payouts.
      </p>

      <div
        style={{
          marginTop: 18,
          border: "1px solid #eee",
          borderRadius: 18,
          background: "#fff",
          padding: 18,
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
        }}
      >
        {!user ? (
          <button
            onClick={handleGoogle}
            style={{
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Continue with Google
          </button>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 800, color: "#111" }}>Signed in as</div>
            <div style={{ color: "#555" }}>{user.email}</div>
          </div>
        )}

        {user && !planLoading && !planIsActive && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>Choose a seller plan</div>
            <div style={{ color: "#555", marginTop: 6 }}>
              Plan required to upload images. Limits are enforced automatically.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 14 }}>
              {Object.values(PLANS).map((p) => {
                const active = selectedPlan === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 16,
                      padding: 14,
                      border: active ? "2px solid #7c3aed" : "1px solid #eee",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 900, color: "#111" }}>{p.name}</div>
                    <div style={{ marginTop: 6, color: "#555" }}>{formatINR(p.price)} / 180 days</div>
                    <div style={{ marginTop: 10, color: "#444", fontSize: 13.5, lineHeight: 1.55 }}>
                      Max uploads: <b>{p.maxUploads}</b>
                      <br />
                      Max price/image: <b>₹{p.maxPrice}</b>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={purchasePlan}
              disabled={paying}
              style={{
                marginTop: 14,
                background: "#111",
                color: "#fff",
                border: "none",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 900,
                cursor: paying ? "not-allowed" : "pointer",
                opacity: paying ? 0.7 : 1,
              }}
            >
              {paying ? "Processing payment..." : "Purchase Plan"}
            </button>
          </div>
        )}

        {user && planIsActive && needsProfile && (
          <form onSubmit={saveProfile} style={{ marginTop: 18, display: "grid", gap: 12, maxWidth: 560 }}>
            <div style={{ fontWeight: 900, color: "#111" }}>Complete your seller profile</div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Full Name</div>
              <input
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                required
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Phone Number</div>
              <input
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                required
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>UPI Address (for weekly payout)</div>
              <input
                value={profile.upi}
                onChange={(e) => setProfile((p) => ({ ...p, upi: e.target.value }))}
                placeholder="example@upi"
                required
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 900,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save & Go to Dashboard"}
            </button>
          </form>
        )}

        {user && planIsActive && !needsProfile && (
          <div style={{ marginTop: 18 }}>
            <button
              onClick={() => nav("/seller-dashboard")}
              style={{
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Go to Seller Dashboard
            </button>
          </div>
        )}

        <style>{`
          @media (max-width: 980px){
            div[style*="grid-template-columns: repeat(3, 1fr)"]{ grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
