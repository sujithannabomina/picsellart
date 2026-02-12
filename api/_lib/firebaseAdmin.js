import admin from "firebase-admin";
import { safeEnv } from "./utils.js";

let _app;

function normalizeBucketName(v) {
  const s = String(v || "").trim();
  if (!s) return "";
  // If someone put gs://... accidentally, strip it
  if (s.startsWith("gs://")) return s.replace("gs://", "");
  return s;
}

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

  // Prefer explicit env bucket (recommended)
  // Your Firebase console shows: picsellart-619a7.firebasestorage.app
  const envBucket =
    safeEnv("FIREBASE_STORAGE_BUCKET") ||
    safeEnv("VITE_FIREBASE_STORAGE_BUCKET");

  // If not set, fallback to classic appspot bucket
  const fallbackBucket = serviceAccount?.project_id
    ? `${serviceAccount.project_id}.appspot.com`
    : "";

  const storageBucket = normalizeBucketName(envBucket || fallbackBucket);

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
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (!token) {
    const err = new Error("Missing Authorization bearer token");
    err.code = "AUTH_MISSING";
    throw err;
  }

  init();
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded; // { uid, email, ... }
}
