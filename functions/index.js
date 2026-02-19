// FILE PATH: functions/index.js
// ✅ COMPLETE SELLER EARNINGS TRACKING SYSTEM

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

// ✅ CREATE ORDER (existing function)
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

// ✅ VERIFY PAYMENT (with seller earnings tracking)
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
        } = req.body || {};

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ error: "Missing payment fields" });
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

        // ✅ Get item details (includes seller info)
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
            console.error("Error fetching item:", err);
          }
        }

        // ✅ Calculate earnings
        const salePrice = Number(amount) || 0;
        const platformFee = Math.round(salePrice * COMMISSION_RATE);
        const sellerEarning = salePrice - platformFee;

        // ✅ Create purchase record
        const purchaseRef = db.collection("purchases").doc();
        await purchaseRef.set({
          buyerUid,
          itemId: itemId || "",
          amount: salePrice,
          price: salePrice,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          
          // ✅ Item details
          fileName: itemData?.fileName || "",
          displayName: itemData?.displayName || "Photo",
          storagePath: itemData?.storagePath || "",
          downloadUrl: itemData?.downloadUrl || "",
          
          // ✅ Seller info
          sellerId: sellerId,
          itemType: itemType,
          
          createdAt: FieldValue.serverTimestamp(),
        });

        // ✅ Create sale record (only for seller uploads, not samples)
        if (sellerId && itemType === "seller") {
          await db.collection("sales").add({
            // Sale identification
            saleId: purchaseRef.id,
            purchaseId: purchaseRef.id,
            
            // Parties involved
            sellerId: sellerId,
            buyerId: buyerUid,
            
            // Item details
            itemId: itemId,
            itemName: itemData?.displayName || "Photo",
            itemFileName: itemData?.fileName || "",
            
            // Financial details
            salePrice: salePrice,
            sellerEarning: sellerEarning,
            platformFee: platformFee,
            commissionRate: COMMISSION_RATE,
            
            // Payment details
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            
            // Payout tracking
            payoutStatus: "pending", // pending, processing, paid, failed
            payoutDate: null,
            payoutTransactionId: null,
            
            // Timestamps
            soldAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
          });

          // ✅ Update seller's total earnings
          const sellerRef = db.collection("sellers").doc(sellerId);
          await sellerRef.update({
            totalSales: FieldValue.increment(1),
            totalEarnings: FieldValue.increment(sellerEarning),
            pendingEarnings: FieldValue.increment(sellerEarning),
            lastSaleAt: FieldValue.serverTimestamp(),
          });
        }

        return res.status(200).json({ ok: true });
      } catch (err) {
        console.error("verifyPayment error:", err);
        return res.status(500).json({ error: err?.message || "Verification failed" });
      }
    })();
  }
);

// ✅ NEW: Get Seller Earnings
export const getSellerEarnings = onRequest(
  {
    region: REGION,
    invoker: "public",
  },
  (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") return res.status(204).send("");

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    (async () => {
      try {
        const { sellerId } = req.body || {};

        if (!sellerId) {
          return res.status(400).json({ error: "Missing sellerId" });
        }

        const db = getFirestore();

        // Get seller data
        const sellerDoc = await db.collection("sellers").doc(sellerId).get();
        if (!sellerDoc.exists) {
          return res.status(404).json({ error: "Seller not found" });
        }

        const sellerData = sellerDoc.data();

        // Get all sales for this seller
        const salesSnapshot = await db
          .collection("sales")
          .where("sellerId", "==", sellerId)
          .orderBy("soldAt", "desc")
          .get();

        const sales = [];
        let totalEarnings = 0;
        let pendingEarnings = 0;
        let paidEarnings = 0;

        salesSnapshot.forEach((doc) => {
          const sale = { id: doc.id, ...doc.data() };
          sales.push(sale);

          totalEarnings += sale.sellerEarning || 0;
          if (sale.payoutStatus === "pending") {
            pendingEarnings += sale.sellerEarning || 0;
          } else if (sale.payoutStatus === "paid") {
            paidEarnings += sale.sellerEarning || 0;
          }
        });

        return res.status(200).json({
          sellerId,
          upiId: sellerData.upiId || "",
          totalEarnings,
          pendingEarnings,
          paidEarnings,
          totalSales: sales.length,
          sales,
        });
      } catch (err) {
        console.error("getSellerEarnings error:", err);
        return res.status(500).json({ error: err?.message || "Failed to fetch earnings" });
      }
    })();
  }
);

// ✅ WEBHOOK (existing function)
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