import admin from "firebase-admin";

// Initialize Admin SDK once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}
const db = admin.firestore();

/**
 * Securely creates a photo document after verifying:
 *  - Seller exists and has active plan (not expired)
 *  - Upload count < plan.uploadLimit
 *  - price <= plan.maxPricePerPhoto
 */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { uid, title, price, tags, watermarkedUrl, originalPath } = req.body;

    if (!uid || !title || !price || !watermarkedUrl || !originalPath) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get user and plan
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();
    if (userData.role !== "seller") return res.status(403).json({ error: "Not a seller" });
    if (!userData.plan || !userData.plan.expiresAt) return res.status(403).json({ error: "No active plan" });

    const now = admin.firestore.Timestamp.now();
    if (userData.plan.expiresAt.toMillis() <= now.toMillis()) {
      return res.status(403).json({ error: "Plan expired" });
    }

    // Validate price
    const numericPrice = Number(price);
    if (numericPrice > userData.plan.maxPricePerPhoto) {
      return res.status(403).json({ error: `Price exceeds max of ₹${userData.plan.maxPricePerPhoto}` });
    }

    // Count current uploads
    const countSnap = await db.collection("photos").where("ownerUid", "==", uid).count().get();
    const uploadCount = countSnap.data().count || 0;
    if (uploadCount >= userData.plan.uploadLimit) {
      return res.status(403).json({ error: "Upload limit reached" });
    }

    // Create new photo doc
    const photoId = `photo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    await db.collection("photos").doc(photoId).set({
      id: photoId,
      ownerUid: uid,
      title,
      price: numericPrice,
      tags,
      watermarkedUrl,
      originalPath,
      planId: userData.plan.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ status: "success", photoId });
  } catch (err) {
    console.error("secureCreatePhoto error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
