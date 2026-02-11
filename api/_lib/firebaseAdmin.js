// FILE PATH: api/_lib/firebaseAdmin.js
import admin from "firebase-admin";

let _app;

function getServiceAccountFromEnv() {
  // You have this in Vercel: FIREBASE_SERVICE_ACCOUNT
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT in Vercel env.");

  // It is usually stored as JSON string.
  // Sometimes people paste it with escaped newlines - handle both.
  try {
    const parsed = JSON.parse(raw);
    if (parsed.private_key && typeof parsed.private_key === "string") {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  } catch (e) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON.");
  }
}

export function getAdmin() {
  if (_app) return admin;

  const serviceAccount = getServiceAccountFromEnv();
  _app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Use either FIREBASE_STORAGE_BUCKET or VITE_FIREBASE_STORAGE_BUCKET
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.VITE_FIREBASE_STORAGE_BUCKET ||
      serviceAccount.project_id
        ? `${serviceAccount.project_id}.appspot.com`
        : undefined,
  });

  return admin;
}

export function getDb() {
  const a = getAdmin();
  return a.firestore();
}

export function getBucket() {
  const a = getAdmin();
  return a.storage().bucket();
}
