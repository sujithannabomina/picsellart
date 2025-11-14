// src/utils/purchases.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

/**
 * Record a successful image purchase in Firestore.
 * Called after Razorpay payment succeeds.
 */
export async function recordPurchase({
  userId,
  imageId,
  imageName,
  imageUrl,
  price,
  currency = "INR",
  paymentId,
}) {
  if (!userId || !imageId || !paymentId) {
    console.warn("recordPurchase called with missing fields", {
      userId,
      imageId,
      paymentId,
    });
  }

  const purchasesRef = collection(db, "purchases");

  await addDoc(purchasesRef, {
    userId,
    imageId,
    imageName,
    imageUrl,
    price,
    currency,
    paymentId,
    createdAt: serverTimestamp(),
  });
}

/**
 * Fetch all purchases for a given buyer (userId),
 * ordered from newest to oldest.
 *
 * Used by: src/pages/BuyerDashboard.jsx
 */
export async function getPurchasesForBuyer(userId) {
  if (!userId) return [];

  const purchasesRef = collection(db, "purchases");

  const q = query(
    purchasesRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      imageId: data.imageId,
      imageName: data.imageName,
      imageUrl: data.imageUrl,
      price: data.price,
      currency: data.currency || "INR",
      paymentId: data.paymentId,
      createdAt: data.createdAt ?? null,
    };
  });
}
