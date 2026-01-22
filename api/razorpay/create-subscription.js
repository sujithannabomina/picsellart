// api/razorpay/create-subscription.js
const { getRazorpay } = require("./razorpay");
const { db } = require("../../src/lib/firebaseAdmin");

const PLAN_MAP = {
  starter: { name: "Seller Activation - Starter", amountINR: 100 },
  pro: { name: "Seller Activation - Pro", amountINR: 300 },
  elite: { name: "Seller Activation - Elite", amountINR: 800 },
};

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { uid, planId } = req.body || {};
    if (!uid) return res.status(400).json({ error: "Missing uid" });
    if (!PLAN_MAP[planId]) return res.status(400).json({ error: "Invalid planId" });

    const rz = getRazorpay();

    // Reuse created Razorpay plan_id stored in Firestore to avoid duplicates
    const planDocRef = db.collection("razorpay_plans").doc(planId);
    const planDoc = await planDocRef.get();

    let razorpayPlanId = planDoc.exists ? planDoc.data().razorpayPlanId : null;

    if (!razorpayPlanId) {
      const rpPlan = await rz.plans.create({
        period: "monthly",
        interval: 6, // 6-month cycle
        item: {
          name: PLAN_MAP[planId].name,
          amount: PLAN_MAP[planId].amountINR * 100,
          currency: "INR",
        },
        notes: {
          purpose: "seller_activation",
          planId,
        },
      });

      razorpayPlanId = rpPlan.id;

      await planDocRef.set(
        {
          planId,
          razorpayPlanId,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    // Create subscription
    const subscription = await rz.subscriptions.create({
      plan_id: razorpayPlanId,
      total_count: 60, // long-running; user can cancel from UPI app
      customer_notify: 1,
      notes: {
        purpose: "seller_activation",
        planId,
        sellerUid: uid,
      },
    });

    // Track subscription on server side (optional)
    await db.collection("subscriptions").doc(subscription.id).set(
      {
        subscriptionId: subscription.id,
        uid,
        planId,
        status: subscription.status,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.status(200).json({
      subscriptionId: subscription.id,
      shortRef: `${planId}_${uid.slice(0, 6)}`,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
};
