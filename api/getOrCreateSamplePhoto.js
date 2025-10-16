import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

/**
 * Body: { id, title, price, originalUrl, watermarkedUrl, storagePath }
 * id should be "sample::<filename>"
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { id, title, price, originalUrl, watermarkedUrl, storagePath } =
      req.body || {};
    if (!id || !title || !price || !originalUrl || !watermarkedUrl) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const docRef = db.collection("photos").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      await docRef.set({
        title,
        price,
        originalUrl,
        watermarkedUrl,
        isPublished: true,
        isSample: true,
        ownerUid: "admin",
        storagePath: storagePath || null,
        createdAt: new Date(),
      });
    }

    res.status(200).json({ photoId: id });
  } catch (e) {
    res.status(500).json({ error: e.message || "Failed to upsert sample" });
  }
}
