// FILE: functions/index.js - UPDATED verifyPayment function
// ✅ FIX: Now saves storagePath so downloads work

// Replace ONLY the verifyPayment function in your functions/index.js

export const verifyPayment = onRequest(
  {
    region: REGION,
    secrets: [RAZORPAY_KEY_SECRET],
    invoker: "public",
  },
  (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") return res.status(204).send("");

    cors(req, res, async () => {
      try {
        if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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

        // ✅ CRITICAL: Get item details (includes storagePath)
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
              
              console.log("✅ Item data fetched:", {
                fileName: itemData.fileName,
                storagePath: itemData.storagePath,
                downloadUrl: itemData.downloadUrl,
              });
            } else {
              console.error("❌ Item not found:", itemId);
            }
          } catch (err) {
            console.error("❌ Error fetching item:", err);
          }
        }

        // ✅ Calculate earnings
        const salePrice = Number(amount) || 0;
        const platformFee = Math.round(salePrice * COMMISSION_RATE);
        const sellerEarning = salePrice - platformFee;

        // ✅ FIXED: Create purchase record with ALL required fields
        const purchaseRef = db.collection("purchases").doc();
        await purchaseRef.set({
          buyerUid,
          itemId: itemId || "",
          amount: salePrice,
          price: salePrice,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          
          // ✅ CRITICAL: Save ALL item details for download
          fileName: itemData?.fileName || "",
          displayName: itemData?.displayName || "Photo",
          storagePath: itemData?.storagePath || "",  // ✅ THIS WAS MISSING!
          downloadUrl: itemData?.downloadUrl || "",
          
          // ✅ Seller info
          sellerId: sellerId,
          itemType: itemType,
          
          createdAt: FieldValue.serverTimestamp(),
        });

        console.log("✅ Purchase created with storagePath:", itemData?.storagePath);

        // ✅ Create sale record (only for seller uploads)
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

          // Update seller's total earnings
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
        console.error("❌ verifyPayment error:", err);
        return res.status(500).json({ error: err?.message || "Verification failed" });
      }
    });
  }
);