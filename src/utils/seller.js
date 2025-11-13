// Firestore helpers for seller profile + limits
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { DEFAULT_SELLER_LIMITS, getPlanById } from "./plans";

/**
 * Ensure seller profile exists and return it.
 * Stored at: sellers/{uid}
 */
export async function ensureSellerProfile(uid, overrides = {}) {
  const ref = doc(db, "sellers", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const baseProfile = {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      planId: DEFAULT_SELLER_LIMITS.planId,
      uploadsUsed: 0,
      maxUploads: DEFAULT_SELLER_LIMITS.maxUploads,
      maxPricePerImage: DEFAULT_SELLER_LIMITS.maxPricePerImage,
      expiresAt: null,
      ...overrides,
    };
    await setDoc(ref, baseProfile);
    return { id: ref.id, ...baseProfile };
  }

  return { id: ref.id, ...snap.data() };
}

/**
 * Update seller plan after successful payment.
 */
export async function applyPlanToSeller(uid, planId) {
  const plan = getPlanById(planId) || getPlanById(DEFAULT_SELLER_LIMITS.planId);
  const ref = doc(db, "sellers", uid);

  const expiresAt =
    plan?.durationDays != null
      ? new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000)
      : null;

  await updateDoc(ref, {
    planId: plan.id,
    maxUploads: plan.maxUploads,
    maxPricePerImage: plan.maxPricePerImage,
    uploadsUsed: 0,
    expiresAt,
    updatedAt: serverTimestamp(),
  });

  const snap = await getDoc(ref);
  return { id: ref.id, ...snap.data() };
}

/**
 * Get current limits for seller (used by SellerDashboard).
 */
export async function getSellerLimits(uid) {
  const profile = await ensureSellerProfile(uid);
  return {
    planId: profile.planId || DEFAULT_SELLER_LIMITS.planId,
    maxUploads: profile.maxUploads ?? DEFAULT_SELLER_LIMITS.maxUploads,
    maxPricePerImage:
      profile.maxPricePerImage ?? DEFAULT_SELLER_LIMITS.maxPricePerImage,
    uploadsUsed: profile.uploadsUsed ?? 0,
    expiresAt: profile.expiresAt ?? null,
  };
}

/**
 * Record a successful image upload.
 * Call after Firestore record for image is written.
 */
export async function recordSellerUpload(uid, incrementBy = 1) {
  const ref = doc(db, "sellers", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await ensureSellerProfile(uid);
    return recordSellerUpload(uid, incrementBy);
  }

  const current = snap.data();
  const uploadsUsed = (current.uploadsUsed || 0) + incrementBy;

  await updateDoc(ref, {
    uploadsUsed,
    updatedAt: serverTimestamp(),
  });

  return uploadsUsed;
}
