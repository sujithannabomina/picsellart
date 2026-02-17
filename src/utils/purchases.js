// FILE PATH: src/utils/purchases.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export async function getPurchasesForBuyer(buyerUid) {
  if (!buyerUid) return [];
  
  // ✅ FIX: Removed orderBy to avoid needing a Firestore index
  // You can add orderBy back later after creating the index in Firebase Console
  const q = query(
    collection(db, "purchases"),
    where("buyerUid", "==", buyerUid)
  );
  
  const snap = await getDocs(q);
  const purchases = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  
  // Sort in JavaScript instead (newest first)
  return purchases.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
}