// src/utils/seller.js
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  increment,
} from "firebase/firestore";
import { getPlanById } from "./plans";

const collectionName = "sellers";

export const getSellerProfile = async (uid) => {
  const ref = doc(db, collectionName, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
};

export const ensureSellerProfile = async (uid, email) => {
  const existing = await getSellerProfile(uid);
  if (existing) return existing;

  const ref = doc(db, collectionName, uid);
  const now = Timestamp.now();
  const profile = {
    uid,
    email: email || "",
    activePlanId: null,
    planExpiresAt: null,
    uploadCount: 0,
    totalEarnings: 0,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref, profile);
  return profile;
};

export const activateSellerPlan = async (uid, planId) => {
  const plan = getPlanById(planId);
  if (!plan) throw new Error("Unknown plan");

  const ref = doc(db, collectionName, uid);
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(
    now.toMillis() + plan.durationDays * 24 * 60 * 60 * 1000
  );

  await setDoc(
    ref,
    {
      activePlanId: plan.id,
      planExpiresAt: expiresAt,
      updatedAt: now,
    },
    { merge: true }
  );
};

export const recordSellerUpload = async (uid, price) => {
  const ref = doc(db, collectionName, uid);
  await setDoc(
    ref,
    {
      uploadCount: increment(1),
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};
