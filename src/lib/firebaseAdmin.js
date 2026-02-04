// FILE PATH: src/lib/firebaseAdmin.js
// Uses FIREBASE_SERVICE_ACCOUNT as a JSON string in Vercel env vars.
// IMPORTANT: Keep this file SERVER-ONLY (API routes / serverless). Never import in React frontend.

import admin from "firebase-admin";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env var.");

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
export { admin };
