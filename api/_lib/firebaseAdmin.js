// FILE PATH: api/_lib/firebaseAdmin.js
const admin = require("firebase-admin");

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env var (service account JSON).");

  // Vercel env strings sometimes store JSON with escaped newlines
  let sa;
  try {
    sa = JSON.parse(raw);
  } catch {
    // Try to recover if it was pasted with single quotes etc.
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON.");
  }

  if (sa.private_key && typeof sa.private_key === "string") {
    sa.private_key = sa.private_key.replace(/\\n/g, "\n");
  }
  return sa;
}

function initAdmin() {
  if (admin.apps.length) return admin.app();

  const serviceAccount = getServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // e.g. "picsellart-619a7.firebasestorage.app"
  });

  return admin.app();
}

function getDb() {
  initAdmin();
  return admin.firestore();
}

function getBucket() {
  initAdmin();
  return admin.storage().bucket();
}

module.exports = { admin, initAdmin, getDb, getBucket };
