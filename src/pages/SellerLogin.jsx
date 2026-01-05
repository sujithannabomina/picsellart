// src/pages/SellerLogin.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { PLANS, computePlanExpiryISO, getPlan } from "../utils/plans";
import { createRazorpayOrder, verifyRazorpayPayment } from "../utils/razorpay";
import loadRazorpay from "../utils/loadRazorpay";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SellerLogin() {
  const nav = useNavigate();
  const qs = useQuery();

  const forcedStep = qs.get("step") || "login";
  const prePlan = qs.get("plan");

  const [mode, setMode] = useState(forcedStep === "plan" ? "plan" : "login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [selectedPlan, setSelectedPlan] = useState(prePlan || "starter");
  const planObj = useMemo(() => getPlan(selectedPlan), [selectedPlan]);

  useEffect(() => {
    if (forcedStep === "plan") setMode("plan");
  }, [forcedStep]);

  async function ensureSellerDoc(uid, data) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        role: "seller",
        email: data?.email || "",
        createdAt: new Date().toISOString(),
        uploadsUsed: 0,
        planId: null,
        planExpiresAt: null,
      });
    }
    return ref;
  }

  async function handleAuth(type) {
    setErr("");
    setBusy(true);
    try {
      let cred;
      if (type === "signup") {
        cred = await createUserWithEmailAndPassword(auth, email, pass);
      } else {
        cred = await signInWithEmailAndPassword(auth, email, pass);
      }

      const uid = cred.user.uid;
      const userRef = await ensureSellerDoc(uid, { email });

      const snap = await getDoc(userRef);
      const data = snap.data() || {};
      const expiresAt = data?.planExpiresAt;

      // If plan active -> go dashboard
      if (expiresAt && new Date(expiresAt).getTime() > Date.now()) {
        nav("/seller-dashboard");
      } else {
        // Force plan purchase
        setMode("plan");
      }
    } catch (e) {
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function payForPlan() {
    setErr("");
    setBusy(true);
    try {
      const user = auth.currentUser;
      if (!user?.uid) throw new Error("Please login first.");

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Razorpay SDK failed to load.");

      const amountPaise = Number(planObj.priceINR) * 100;

      const order = await createRazorpayOrder({
        amountPaise,
        receipt: `seller_${user.uid}_${planObj.id}_${Date.now()}`,
        notes: { uid: user.uid, planId: planObj.id },
      });

      const options = {
        key: order.key_id, // sent from serverless
        amount: order.amount,
        currency: order.currency,
        name: "PicSellart",
        description: `Seller Plan: ${planObj.name}`,
        order_id: order.id,
        prefill: { email: user.email || "" },
        theme: { color: "#7c3aed" },
        handler: async function (response) {
          try {
            // Verify signature via serverless
            const verify = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verify?.ok) throw new Error("Payment not verified.");

            // Save plan to Firestore (fast path for production)
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              role: "seller",
              planId: planObj.id,
              planPurchasedAt: new Date().toISOString(),
              planExpiresAt: computePlanExpiryISO(planObj.durationDays),
              uploadsUsed: 0,
            });

            nav("/seller-dashboard");
          } catch (e) {
            setErr(e?.message || "Payment verification failed");
          }
        },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (e) {
      setErr(e?.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="rounded-3xl border bg-white p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === "plan" ? "Choose a Seller Plan" : "Seller Login"}
        </h1>

        <p className="mt-2 text-gray-600">
          {mode === "plan"
            ? "A seller plan is required to access Seller Dashboard and uploads."
            : "Login to manage your uploads, plan, and sales."}
        </p>

        {err && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            {err}
          </div>
        )}

        {mode !== "plan" ? (
          <>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  className="mt-1 w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-purple-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-purple-200"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  disabled={busy}
                  onClick={() => handleAuth("login")}
                  className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                >
                  Login
                </button>

                <button
                  disabled={busy}
                  onClick={() => handleAuth("signup")}
                  className="px-6 py-3 rounded-full border font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Create Seller Account
                </button>

                <button
                  disabled={busy}
                  onClick={() => setMode("plan")}
                  className="px-6 py-3 rounded-full border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition disabled:opacity-50"
                >
                  View Plans
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`rounded-3xl border p-5 text-left hover:bg-gray-50 transition ${
                    selectedPlan === p.id ? "border-purple-400 bg-purple-50" : ""
                  }`}
                >
                  <div className="font-bold text-gray-900">{p.name}</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">₹{p.priceINR}</div>
                  <div className="mt-2 text-sm text-gray-600">
                    {p.durationDays} days • {p.maxUploads} uploads
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Max price ₹{p.maxPricePerImageINR}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              <button
                disabled={busy}
                onClick={payForPlan}
                className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
              >
                Pay ₹{planObj?.priceINR} and Activate
              </button>

              <button
                disabled={busy}
                onClick={() => setMode("login")}
                className="px-6 py-3 rounded-full border font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Back to Login
              </button>
            </div>

            <div className="mt-5 text-sm text-gray-600">
              After payment verification, plan details will show in Seller Dashboard.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
