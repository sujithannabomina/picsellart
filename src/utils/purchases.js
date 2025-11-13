// src/utils/purchases.js
import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const PURCHASES_COLLECTION = "purchases";

/**
 * Save a successful purchase.
 *
 * purchase = {
 *   id,           // payment id from Razorpay
 *   imageName,
 *   imageUrl,
 *   amount,       // in paise
 *   buyerUid,     // optional, but recommended
 *   timestamp     // ms since epoch
 * }
 */
export async function recordPurchase(purchase) {
  if (!purchase || !purchase.id) {
    console.warn("recordPurchase called without id");
    return;
  }

  const ref = doc(db, PURCHASES_COLLECTION, purchase.id);

  const data = {
    imageName: purchase.imageName || "",
    imageUrl: purchase.imageUrl || "",
    amount: purchase.amount || 0,
    buyerUid: purchase.buyerUid || null,
    createdAt: purchase.timestamp
      ? new Date(purchase.timestamp)
      : new Date(),
  };

  await setDoc(ref, data, { merge: true });
}

/**
 * Get all purchases for a specific buyer.
 * Returns newest first.
 */
export async function getPurchasesForBuyer(buyerUid) {
  if (!buyerUid) return [];

  const q = query(
    collection(db, PURCHASES_COLLECTION),
    where("buyerUid", "==", buyerUid),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
