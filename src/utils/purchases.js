import { db } from "../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export async function listPurchases(uid) {
  const q = query(
    collection(db, "purchases"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
