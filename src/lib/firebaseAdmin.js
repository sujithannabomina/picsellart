// FILE PATH: src/lib/firebaseAdmin.js
// Server-only. Used by /api routes.
// Env required in Vercel:
// - FIREBASE_SERVICE_ACCOUNT  (JSON string)
// - FIREBASE_STORAGE_BUCKET   (optional, but recommended)

import admin from "firebase-admin";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env var (JSON string).");
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT must be valid JSON.");
  }
}

if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
  });
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
export { admin };
