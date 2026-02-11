// FILE PATH: api/_lib/firebaseAdmin.js
import admin from "firebase-admin";
import { safeEnv } from "./utils.js";

let _app;

function init() {
  if (_app) return _app;

  const sa = safeEnv("FIREBASE_SERVICE_ACCOUNT");
  if (!sa) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env");

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(sa);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT must be valid JSON string");
  }

  // Optional bucket override (recommended). If not set, we use service account project default.
  const storageBucket =
    safeEnv("FIREBASE_STORAGE_BUCKET") ||
    safeEnv("VITE_FIREBASE_STORAGE_BUCKET") ||
    serviceAccount?.project_id;

  _app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    ...(storageBucket ? { storageBucket } : {}),
  });

  return _app;
}

export function getAdmin() {
  return init();
}

export function getDb() {
  init();
  return admin.firestore();
}

export function getBucket() {
  init();
  return admin.storage().bucket();
}

// Server-side verify Firebase ID token (protects your API)
export async function verifyFirebaseToken(req) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) throw new Error("Missing Authorization bearer token");
  init();
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded; // { uid, email, ... }
}
