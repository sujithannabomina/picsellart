// src/utils/purchases.js
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Record a successful image purchase in Firestore.
 * This powers the Buyer Dashboard history.
 */
export async function recordPurchase({
  userId,
  imageId,
  imageName,
  imageUrl,
  price,
  currency = "INR",
  paymentId
}) {
  if (!userId || !imageId || !paymentId) {
    console.warn("recordPurchase called with missing fields", {
      userId,
      imageId,
      paymentId
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
    createdAt: serverTimestamp()
  });
}
