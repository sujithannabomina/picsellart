// src/utils/purchases.js
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const collectionName = "purchases";

export const recordPurchase = async (buyerUid, photo, paymentInfo) => {
  const ref = collection(db, collectionName);
  await addDoc(ref, {
    buyerUid,
    photoId: photo.id,
    fileName: photo.fileName,
    displayName: photo.name,
    price: photo.price,
    currency: "INR",
    downloadUrl: photo.originalUrl || photo.url,
    createdAt: new Date(),
    razorpay: paymentInfo || null,
  });
};

export const getPurchasesForBuyer = async (buyerUid) => {
  const ref = collection(db, collectionName);
  const q = query(
    ref,
    where("buyerUid", "==", buyerUid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};
