// FILE PATH: src/utils/purchases.js
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";

export async function getPurchasesForBuyer(buyerUid) {
  if (!buyerUid) return [];
  const q = query(
    collection(db, "purchases"),
    where("buyerUid", "==", buyerUid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
