// src/utils/seller.js
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

/**
 * Fetch seller profile document.
 * Stored at: sellers/{uid}
 */
export async function getSellerProfile(uid) {
  const ref = doc(db, "sellers", uid);
  const snap = await getDoc(ref);

  const base = {
    id: uid,
    activePlanId: null,
    planName: null,
    maxUploads: 0,
    maxPrice: 0,
    planExpiresAt: null,
    createdAt: null,
  };

  if (!snap.exists()) {
    return base;
  }

  return { ...base, ...snap.data() };
}

/**
 * Save / update seller plan after successful payment.
 */
export async function upsertSellerPlan(uid, plan) {
  const ref = doc(db, "sellers", uid);

  const expiresAtDate = new Date(
    Date.now() + plan.durationDays * 24 * 60 * 60 * 1000
  );

  const expiresAt = Timestamp.fromDate(expiresAtDate);

  await setDoc(
    ref,
    {
      activePlanId: plan.id,
      planName: plan.name,
      maxUploads: plan.maxUploads,
      maxPrice: plan.maxPrice,
      planExpiresAt: expiresAt,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Check if profile has an active (non-expired) plan.
 */
export function hasActivePlan(profile) {
  if (!profile || !profile.activePlanId || !profile.planExpiresAt) {
    return false;
  }

  const now = new Date();
  const exp = profile.planExpiresAt.toDate
    ? profile.planExpiresAt.toDate()
    : new Date(profile.planExpiresAt);

  return exp > now;
}
