// ═══════════════════════════════════════════════════════════════════════════
// FILE PATH: functions/index.js
// ═══════════════════════════════════════════════════════════════════════════
// INSTRUCTION: Replace the ENTIRE verifyPayment function with this code
// Find: export const verifyPayment = onRequest(
// Replace: Everything until the closing );
// ═══════════════════════════════════════════════════════════════════════════

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const crypto = require("crypto");
const Razorpay = require("razorpay");

admin.initializeApp();

const REGION = "asia-south1";
const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");

// ✅ Commission rate (20% platform fee, 80% to seller)
const COMMISSION_RATE = 0.2;

function setCorsHeaders(req, res) {
  const allowedOrigins = [
    "https://picsellart.com",
    "https://www.picsellart.com",
    "http://localhost:5173",
    "http://localhost:3000",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
}

function getRazorpayClient() {
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID.value(),
    key_secret: RAZORPAY_KEY_SECRET.value(),
  });
}

// ✅ CREATE ORDER
export const createOrder = onRequest(
  {
    region: REGION,
    secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET],
    invoker: "public",
  },
  (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") return res.status(204).send("");

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    (async () => {
      try {
        const { amount, currency = "INR", itemId, buyerUid, type } = req.body || {};

        if (!amount || !buyerUid) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const razorpay = getRazorpayClient();
        const amountPaise = Math.round(Number(amount) * 100);

        const order = await razorpay.orders.create({
          amount: amountPaise,
          currency,
          notes: {
            itemId: itemId || "",
            buyerUid,
            type: type || "photo",
          },
        });

        return res.status(200).json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        });
      } catch (err) {
        console.error("createOrder error:", err);
        return res.status(500).json({ error: err?.message || "Order creation failed" });
      }
    })();
  }
);

// ✅ VERIFY PAYMENT (PRODUCTION-READY - AUTO-CREATES SELLER DOCUMENTS)
export const verifyPayment = onRequest(
  {
    region: REGION,
    secrets: [RAZORPAY_KEY_SECRET],
    invoker: "public",
  },
  (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") return res.status(204).send("");

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    (async () => {
      try {
        const {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          itemId,
          buyerUid,
          amount,
          type,
        } = req.body || {};

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ error: "Missing payment fields" });
        }

        if (!buyerUid) {
          return res.status(400).json({ error: "Missing buyerUid" });
        }

        // ✅ Verify signature
        const key_secret = RAZORPAY_KEY_SECRET.value();
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
          .createHmac("sha256", key_secret)
          .update(body)
          .digest("hex");

        if (expectedSignature !== razorpay_signature) {
          return res.status(400).json({ error: "Invalid signature" });
        }

        const db = getFirestore();
        const paymentType = type || "photo";

        // ========================================
        // ✅ SELLER PLAN PAYMENT
        // ========================================
        if (paymentType === "seller_plan") {
          console.log("🎯 Seller plan payment detected for:", buyerUid);

          const planId = itemId?.replace("seller-plan-", "") || "starter";

          // Get user info
          let userEmail = "";
          let userName = "";
          let userPhoto = "";

          try {
            const buyerDoc = await db.collection("buyers").doc(buyerUid).get();
            if (buyerDoc.exists) {
              const buyerData = buyerDoc.data();
              userEmail = buyerData.email || "";
              userName = buyerData.name || "";
              userPhoto = buyerData.photoURL || "";
            }
          } catch (err) {
            console.log("⚠️ Could not fetch buyer data:", err);
          }

          // ✅ Create seller document (IDEMPOTENT)
          const sellerRef = db.collection("sellers").doc(buyerUid);
          await sellerRef.set(
            {
              uid: buyerUid,
              email: userEmail,
              name: userName,
              photoURL: userPhoto,
              planId: planId,
              orderId: razorpay_order_id,
              paymentId: razorpay_payment_id,
              status: "pending_profile",
              totalSales: 0,
              totalEarnings: 0,
              pendingEarnings: 0,
              createdAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );

          console.log("✅ Seller document created for:", buyerUid, "plan:", planId);

          return res.status(200).json({ 
            ok: true, 
            type: "seller_plan",
            status: "pending_profile"
          });
        }

        // ========================================
        // ✅ PHOTO PURCHASE
        // ========================================
        console.log("🖼️ Photo purchase detected for:", buyerUid);

        let itemData = null;
        let sellerId = null;
        let itemType = "sample";

        if (itemId) {
          try {
            const itemDoc = await db.collection("items").doc(itemId).get();
            if (itemDoc.exists) {
              itemData = itemDoc.data();
              sellerId = itemData.uploadedBy || null;
              itemType = itemData.type || "sample";
            }
          } catch (err) {
            console.error("❌ Error fetching item:", err);
          }
        }

        const salePrice = Number(amount) || 0;
        const platformFee = Math.round(salePrice * COMMISSION_RATE);
        const sellerEarning = salePrice - platformFee;

        // Create purchase record
        const purchaseRef = db.collection("purchases").doc();
        await purchaseRef.set({
          buyerUid,
          itemId: itemId || "",
          amount: salePrice,
          price: salePrice,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          fileName: itemData?.fileName || "",
          displayName: itemData?.displayName || "Photo",
          storagePath: itemData?.storagePath || "",
          downloadUrl: itemData?.downloadUrl || "",
          sellerId: sellerId,
          itemType: itemType,
          createdAt: FieldValue.serverTimestamp(),
        });

        // Create sale record (only for seller uploads)
        if (sellerId && itemType === "seller") {
          await db.collection("sales").add({
            saleId: purchaseRef.id,
            purchaseId: purchaseRef.id,
            sellerId: sellerId,
            buyerId: buyerUid,
            itemId: itemId,
            itemName: itemData?.displayName || "Photo",
            itemFileName: itemData?.fileName || "",
            salePrice: salePrice,
            sellerEarning: sellerEarning,
            platformFee: platformFee,
            commissionRate: COMMISSION_RATE,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            payoutStatus: "pending",
            payoutDate: null,
            payoutTransactionId: null,
            soldAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
          });

          const sellerRef = db.collection("sellers").doc(sellerId);
          await sellerRef.update({
            totalSales: FieldValue.increment(1),
            totalEarnings: FieldValue.increment(sellerEarning),
            pendingEarnings: FieldValue.increment(sellerEarning),
            lastSaleAt: FieldValue.serverTimestamp(),
          });
        }

        console.log("✅ Purchase created:", purchaseRef.id);

        return res.status(200).json({ 
          ok: true, 
          type: "photo_purchase",
          purchaseId: purchaseRef.id 
        });
      } catch (err) {
        console.error("❌ verifyPayment error:", err);
        return res.status(500).json({ 
          error: err?.message || "Verification failed" 
        });
      }
    })();
  }
);

// ✅ WEBHOOK
export const webhook = onRequest(
  {
    region: REGION,
    secrets: [RAZORPAY_KEY_SECRET],
    invoker: "public",
  },
  (req, res) => {
    if (req.method !== "POST") return res.status(405).send("Method not allowed");

    (async () => {
      try {
        const signature = req.headers["x-razorpay-signature"];
        const body = JSON.stringify(req.body);
        const key_secret = RAZORPAY_KEY_SECRET.value();
        const expectedSignature = crypto
          .createHmac("sha256", key_secret)
          .update(body)
          .digest("hex");

        if (signature !== expectedSignature) {
          return res.status(400).send("Invalid signature");
        }

        const event = req.body.event;
        console.log("Webhook event:", event);

        return res.status(200).send("OK");
      } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).send("Error");
      }
    })();
  }
);