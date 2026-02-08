// FILE PATH: src/utils/purchases.js
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const collectionName = "purchases";

export const recordPurchase = async (buyerUid, photo, paymentInfo) => {
  if (!buyerUid) throw new Error("Missing buyer UID.");
  const ref = collection(db, collectionName);

  await addDoc(ref, {
    buyerUid,
    photoId: photo?.id || "",
    fileName: photo?.fileName || "",
    displayName: photo?.name || photo?.displayName || "Photo",
    price: Number(photo?.price || 0),
    currency: "INR",
    storagePath: photo?.storagePath || "",
    downloadUrl: photo?.originalUrl || photo?.url || photo?.downloadUrl || "",
    createdAt: serverTimestamp(),
    razorpay: paymentInfo || null,
  });
};

export const getPurchasesForBuyer = async (buyerUid) => {
  if (!buyerUid) return [];
  const ref = collection(db, collectionName);

  const q = query(ref, where("buyerUid", "==", buyerUid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};
