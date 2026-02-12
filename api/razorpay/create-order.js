import { bad, ok, onlyPost, mask, safeEnv, readJsonBody } from "../_lib/utils.js";
import { verifyFirebaseToken, getDb } from "../_lib/firebaseAdmin.js";
import { getRazorpayClient, getRazorpayKeyId } from "./_lib/razorpay.js";

export default async function handler(req, res) {
  try {
    if (!onlyPost(req, res)) return;

    // 1) Verify Firebase login
    const decoded = await verifyFirebaseToken(req);
    const uid = decoded.uid;

    // 2) Read body safely
    const body = await readJsonBody(req);
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
        storagePath: String(photo.storagePath || "")
      }
    });

    // 4) Store order doc
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
          storagePath: String(photo.storagePath || "")
        }
      },
      { merge: true }
    );

    return ok(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId()
    });
  } catch (e) {
    const msg = e?.message || "create-order failed";

    // Token missing / invalid
    if (e?.code === "AUTH_MISSING") {
      return bad(res, 401, "Auth token missing. Please logout and login again.");
    }

    // Razorpay auth mismatch (LIVE/TEST key-secret mismatch or wrong secret)
    if (msg.toLowerCase().includes("authentication failed")) {
      const kid = safeEnv("RAZORPAY_KEY_ID");
      return bad(res, 500, "Authentication failed", {
        hint:
          "RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET must be the correct pair (both LIVE or both TEST). Re-save env vars on Vercel and redeploy.",
        keyIdPreview: mask(kid, 12)
      });
    }

    return bad(res, 500, msg);
  }
}
