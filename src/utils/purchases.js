import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const collectionName = "purchases";

export const recordPurchase = async (buyerUid, photo, paymentInfo, downloadUrl) => {
  if (!buyerUid) throw new Error("Missing buyer UID.");

  const photoId = photo?.id || "";
  if (!photoId) throw new Error("Missing photo id.");

  const purchaseId = `${buyerUid}_${photoId}`.replace(/\//g, "_");
  const ref = doc(db, collectionName, purchaseId);

  await setDoc(
    ref,
    {
      buyerUid,
      photoId,
      fileName: photo?.fileName || "",
      displayName: photo?.name || photo?.displayName || "Photo",
      price: Number(photo?.price || 0),
      currency: "INR",
      storagePath: photo?.storagePath || "",
      downloadUrl: downloadUrl || "",
      createdAt: serverTimestamp(),
      razorpay: paymentInfo || null,
    },
    { merge: true }
  );
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
