// FILE PATH: src/utils/purchases.js
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";

export async function getPurchasesForBuyer(uid) {
  if (!uid) return [];
  const q = query(
    collection(db, "purchases"),
    where("buyerUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
