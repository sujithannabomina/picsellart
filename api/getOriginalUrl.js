import admin from "firebase-admin";
import { checkRateLimit } from "./_rateLimit.js";

if (!admin.apps.length) {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT;
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(key)),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}
const db = admin.firestore();
const bucket = admin.storage().bucket();

export default async function handler(req, res){
  if (req.method !== "POST") return res.status(405).end();

  const rl = await checkRateLimit(req);
  if (!rl.ok) return res.status(429).json({ error: "rate-limit" });

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  try {
    const decoded = await admin.auth().verifyIdToken(token || "");
    const { photoId } = req.body || {};
    if (!photoId) return res.status(400).json({ error: "photoId-required" });

    // Verify ownership
    const purchases = await db.collection("purchases")
      .where("buyerUid","==",decoded.uid).where("photoId","==",photoId).limit(1).get();
    if (purchases.empty) return res.status(403).json({ error: "not-owned" });

    const photoSnap = await db.collection("photos").doc(photoId).get();
    if (!photoSnap.exists) return res.status(404).json({ error: "photo-not-found" });
    const { originalPath } = photoSnap.data();

    const file = bucket.file(originalPath);
    const [url] = await file.getSignedUrl({ action:"read", expires: Date.now() + 10 * 60 * 1000 });
    res.json({ url });
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
}
