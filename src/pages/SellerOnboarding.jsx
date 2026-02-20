// ═══════════════════════════════════════════════════════════════════════════
// FILE PATH: src/pages/SellerOnboarding.jsx
// ═══════════════════════════════════════════════════════════════════════════
// INSTRUCTION: Replace the ENTIRE file with this code
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import loadRazorpay from "../utils/loadRazorpay";
import { SELLER_PLANS, getPlan } from "../utils/plans";

export default function SellerOnboarding() {
  const { user, booting, googleLogin } = useAuth();
  const nav = useNavigate();

  const [step, setStep] = useState("plan");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(true);

  const [selectedPlanId, setSelectedPlanId] = useState("pro");
  const selectedPlan = useMemo(() => getPlan(selectedPlanId), [selectedPlanId]);

  const [profile, setProfile] = useState({
    displayName: "",
    phone: "",
    upiId: "",
  });

  useEffect(() => {
    if (booting) return;
    if (!user) {
      setCheckingStatus(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const ref = doc(db, "sellers", user.uid);
        const snap = await getDoc(ref);

        if (cancelled) return;

        if (snap.exists()) {
          const d = snap.data();
          
          console.log("📋 Seller status:", d.status);
          
          if (d.status === "active") {
            nav("/seller-dashboard", { replace: true });
            return;
          }
          
          if (d.status === "pending_profile") {
            setStep("profile");
            setProfile((p) => ({
              ...p,
              displayName: d.name || user.displayName || "",
              phone: d.phone || "",
              upiId: d.upiId || "",
            }));
          }
        }

        setProfile((p) => ({
          ...p,
          displayName: p.displayName || user.displayName || "",
        }));
      } catch (error) {
        console.error("Error checking seller status:", error);
      } finally {
        if (!cancelled) setCheckingStatus(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, booting, nav]);

  const ensureLoggedIn = async () => {
    if (user) return user;
    const u = await googleLogin();
    return u;
  };

  const startSellerActivation = async () => {
    setErr("");
    setBusy(true);

    try {
      const u = await ensureLoggedIn();

      if (!selectedPlanId || !selectedPlan) {
        throw new Error("Please select a plan.");
      }

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Razorpay SDK failed to load.");

      const createOrderUrl = import.meta.env.VITE_CREATE_ORDER_URL;
      if (!createOrderUrl) throw new Error("Missing VITE_CREATE_ORDER_URL");

      const res = await fetch(createOrderUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPlan.priceINR,
          currency: "INR",
          itemId: `seller-plan-${selectedPlanId}`,
          buyerUid: u.uid,
          type: "seller_plan",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.orderId) {
        throw new Error(data?.error || "Failed to create order.");
      }

      const { orderId } = data;

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Missing VITE_RAZORPAY_KEY_ID");

      const rz = new window.Razorpay({
        key,
        amount: Math.round(selectedPlan.priceINR * 100),
        currency: "INR",
        order_id: orderId,
        name: "PicSellArt",
        description: `Seller Plan: ${selectedPlan.title}`,
        handler: async function (response) {
          try {
            console.log("💳 Payment successful, verifying...");

            const verifyUrl = import.meta.env.VITE_VERIFY_PAYMENT_URL;
            const vr = await fetch(verifyUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                itemId: `seller-plan-${selectedPlanId}`,
                buyerUid: u.uid,
                amount: selectedPlan.priceINR,
                type: "seller_plan",
              }),
            });

            const vd = await vr.json().catch(() => ({}));
            
            if (!vr.ok || !vd.ok) {
              throw new Error(vd?.error || "Payment verification failed");
            }

            console.log("✅ Payment verified, seller document created by backend");

            await new Promise(resolve => setTimeout(resolve, 1000));

            const sellerRef = doc(db, "sellers", u.uid);
            const sellerSnap = await getDoc(sellerRef);

            if (!sellerSnap.exists()) {
              throw new Error("Seller document not created. Please contact support with payment ID: " + response.razorpay_payment_id);
            }

            const sellerData = sellerSnap.data();
            console.log("✅ Seller document confirmed:", sellerData.status);

            if (sellerData.status === "pending_profile") {
              setStep("profile");
              setBusy(false);
            } else if (sellerData.status === "active") {
              nav("/seller-dashboard", { replace: true });
            }
          } catch (e) {
            console.error("❌ Verification error:", e);
            setErr(e?.message || "Verification failed. Please contact support.");
            setBusy(false);
          }
        },
        prefill: {
          name: u.displayName || "",
          email: u.email || "",
        },
        notes: {
          purpose: "seller_activation",
          planId: selectedPlanId,
          sellerUid: u.uid,
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => {
            setBusy(false);
          },
        },
      });

      rz.open();
    } catch (e) {
      console.error("❌ Activation error:", e);
      setErr(e?.message || "Activation failed");
      setBusy(false);
    }
  };

  const saveProfile = async () => {
    setErr("");
    setBusy(true);
    try {
      if (!user) throw new Error("Please login first.");

      const upiClean = (profile.upiId || "").trim();
      if (!upiClean) {
        throw new Error("UPI ID is required for withdrawals/earnings.");
      }

      const sellerRef = doc(db, "sellers", user.uid);
      const snap = await getDoc(sellerRef);
      
      if (!snap.exists()) {
        throw new Error("Seller account not found. Please try activating again or contact support.");
      }

      await updateDoc(sellerRef, {
        name: profile.displayName || user.displayName || "",
        phone: (profile.phone || "").trim(),
        upiId: upiClean,
        status: "active",
        updatedAt: serverTimestamp(),
      });

      console.log("✅ Profile completed, redirecting to dashboard");
      nav("/seller-dashboard", { replace: true });
    } catch (e) {
      console.error("❌ Profile save error:", e);
      setErr(e?.message || "Profile save failed");
    } finally {
      setBusy(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Seller Setup</h1>
        <p className="mt-2 text-slate-600">
          {step === "plan" 
            ? "Select a plan to activate your seller account."
            : "Complete your profile to start uploading."}
        </p>

        {err ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {step === "plan" ? (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {SELLER_PLANS.map((p) => {
                const maxPrice = p.maxPriceINR ?? p.maxPricePerImageINR ?? 0;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={[
                      "rounded-2xl border p-5 text-left hover:border-slate-400",
                      selectedPlanId === p.id
                        ? "border-blue-600 ring-2 ring-blue-600"
                        : "border-slate-200",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold">{p.title}</div>
                        <div className="mt-1 text-sm text-slate-600">{p.badge}</div>
                      </div>
                      <div className="text-lg font-semibold">₹{p.priceINR}</div>
                    </div>

                    <div className="mt-4 text-sm text-slate-700">{p.description}</div>

                    <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <div>Upload limit: <span className="font-medium">{p.maxUploads}</span></div>
                      <div>Max price per image: <span className="font-medium">₹{maxPrice}</span></div>
                      <div className="mt-2 text-xs text-slate-500">
                        One-time payment for 6 months access
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={startSellerActivation}
              disabled={busy}
              className="psa-btn-primary mt-8 w-full rounded-2xl py-3 disabled:opacity-60"
            >
              {busy ? "Processing..." : "Activate Seller Account"}
            </button>

            <div className="mt-3 text-xs text-slate-500">
              One-time payment. No recurring charges.
            </div>
          </>
        ) : (
          <>
            <div className="mt-8 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold">Seller Profile</h2>
              <p className="mt-1 text-sm text-slate-600">
                Enter your details. <span className="font-medium">UPI ID is required for payouts.</span>
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Display Name</label>
                  <input
                    value={profile.displayName}
                    onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Phone (optional)</label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                    placeholder="10-digit number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    UPI ID (for withdrawals/earnings)
                  </label>
                  <input
                    value={profile.upiId}
                    onChange={(e) => setProfile((p) => ({ ...p, upiId: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                    placeholder="example@upi"
                  />
                </div>
              </div>

              <button
                onClick={saveProfile}
                disabled={busy}
                className="psa-btn-primary mt-6 w-full rounded-2xl py-3 disabled:opacity-60"
              >
                {busy ? "Saving..." : "Finish & Go to Dashboard"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}