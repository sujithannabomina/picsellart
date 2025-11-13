import { db, storage } from "../firebase";
import {
  doc, getDoc, updateDoc, setDoc, serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Returns active plan or null.
 */
export async function getActivePlan(uid) {
  const d = await getDoc(doc(db, "plans", uid));
  if (!d.exists()) return null;
  const p = d.data();
  return p.active ? p : null;
}

/**
 * Validates price and remaining uploads.
 * Throws an Error with friendly message if invalid.
 */
export function validateUpload(plan, price) {
  if (!plan?.active) throw new Error("No active plan. Please purchase a plan.");
  if (plan.uploads <= 0) throw new Error("Upload limit reached for current plan.");
  if (Number(price) > Number(plan.maxPrice)) {
    throw new Error(`Price exceeds cap ₹${plan.maxPrice} for your plan.`);
  }
}

/**
 * Uploads file to public/ (so Explore can see it),
 * decrements plan.uploads, and records a seller_uploads document.
 * Returns { url, path, docId }.
 */
export async function uploadSellerFile({ uid, file, price }) {
  const safeName = `${uid}-${Date.now()}-${file.name}`;
  const path = `public/${safeName}`;
  const r = ref(storage, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);

  // decrement quota
  const planRef = doc(db, "plans", uid);
  const planSnap = await getDoc(planRef);
  if (planSnap.exists()) {
    const cur = planSnap.data();
    const left = Math.max(0, (cur.uploads || 0) - 1);
    await updateDoc(planRef, { uploads: left });
  }

  // record file
  const upRef = doc(db, "seller_uploads", `${uid}-${Date.now()}`);
  await setDoc(upRef, {
    uid,
    filename: file.name,
    price: Number(price),
    path,
    url,
    createdAt: serverTimestamp(),
  });

  return { url, path, docId: upRef.id };
}
