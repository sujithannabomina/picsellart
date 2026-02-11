// FILE PATH: src/utils/purchases.js
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase"; // IMPORTANT: your project must already export db from src/firebase.js

export async function getPurchasesForBuyer(uid) {
  if (!uid) return [];

  const ref = collection(db, "buyers", uid, "purchases");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  const items = [];
  snap.forEach((doc) => {
    const d = doc.data() || {};
    items.push({
      id: d.id || doc.id,
      price: Number(d?.photo?.price || d?.price || d?.amountINR || 0),
      fileName: d?.photo?.fileName || d?.fileName || "",
      displayName: d?.photo?.displayName || d?.displayName || "",
      storagePath: d?.photo?.storagePath || d?.storagePath || "",
      downloadUrl: d?.downloadUrl || "",
      createdAt: d?.createdAt || "",
    });
  });

  return items;
}
