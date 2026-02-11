// FILE PATH: api/razorpay/create-order.js
import { bad, ok, onlyPost, mask, safeEnv } from "../_lib/utils.js";
import { verifyFirebaseToken, getDb } from "../_lib/firebaseAdmin.js";
import { getRazorpayClient, getRazorpayKeyId } from "./_lib/razorpay.js";

export default async function handler(req, res) {
  try {
    if (!onlyPost(req, res)) return;

    // 1) Verify Firebase login (server trusts this, not buyerUid from client)
    const decoded = await verifyFirebaseToken(req);
    const uid = decoded.uid;

    // 2) Validate body
    const body = req.body || {};
    const amountINR = Number(body.amountINR);
    const photo = body.photo || {};

    if (!Number.isFinite(amountINR) || amountINR <= 0) {
      return bad(res, 400, "Invalid amount");
    }
    if (!photo?.id) return bad(res, 400, "Missing photo.id");

    // Razorpay expects paise
    const amount = Math.round(amountINR * 100);

    const rzp = getRazorpayClient();

    // 3) Create order
    const receipt = `psa_${uid}_${Date.now()}`;

    const order = await rzp.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        purpose: "buyer_purchase",
        buyerUid: uid,
        photoId: String(photo.id),
        storagePath: String(photo.storagePath || ""),
      },
    });

    // 4) Store an orders doc (optional but useful)
    const db = getDb();
    await db.collection("orders").doc(order.id).set(
      {
        buyerUid: uid,
        buyerEmail: decoded.email || "",
        status: "created",
        createdAt: Date.now(),
        amountINR,
        amount,
        currency: "INR",
        photo: {
          id: String(photo.id),
          fileName: String(photo.fileName || ""),
          displayName: String(photo.displayName || ""),
          storagePath: String(photo.storagePath || ""),
        },
      },
      { merge: true }
    );

    // 5) Return order + keyId (front-end uses VITE_RAZORPAY_KEY_ID, but this is extra safe)
    return ok(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
    });
  } catch (e) {
    // Authentication failed from Razorpay will land here too
    const msg = e?.message || "create-order failed";

    // If Razorpay auth fails, THIS is the real cause (keys mismatch / wrong env)
    if (msg.toLowerCase().includes("authentication failed")) {
      const kid = safeEnv("RAZORPAY_KEY_ID");
      return bad(res, 500, "Authentication failed", {
        hint: "Check RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET are correct pair (same mode: LIVE or TEST). Remove extra spaces/quotes in Vercel env.",
        keyIdPreview: mask(kid, 10),
      });
    }

    return bad(res, 500, msg);
  }
}
