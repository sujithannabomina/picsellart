// api/_lib/firebaseAdmin.js
import * as admin from "firebase-admin";
import { safeJsonParse } from "./utils.js";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;

  // Try JSON directly
  const j1 = safeJsonParse(raw);
  if (j1) return j1;

  // Try base64
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    const j2 = safeJsonParse(decoded);
    if (j2) return j2;
  } catch {}

  return null;
}

export function initAdmin() {
  if (admin.apps.length) return admin;

  const svc = getServiceAccount();
  if (!svc) {
    throw new Error("Missing or invalid FIREBASE_SERVICE_ACCOUNT env var.");
  }

  const bucket =
    process.env.FIREBASE_STORAGE_BUCKET ||
    svc.storageBucket ||
    (svc.project_id ? `${svc.project_id}.appspot.com` : null);

  admin.initializeApp({
    credential: admin.credential.cert(svc),
    storageBucket: bucket || undefined,
  });

  return admin;
}
