// FILE PATH: api/_lib/firebaseAdmin.js
const admin = require("firebase-admin");

function initAdmin() {
  if (admin.apps.length) return admin;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT in Vercel env.");

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(raw);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT must be valid JSON (stringified).");
  }

  const bucketFromEnv = process.env.FIREBASE_STORAGE_BUCKET;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket:
      bucketFromEnv ||
      (serviceAccount.project_id ? `${serviceAccount.project_id}.appspot.com` : undefined),
  });

  return admin;
}

function db() {
  return initAdmin().firestore();
}

function bucket() {
  return initAdmin().storage().bucket();
}

module.exports = { initAdmin, db, bucket };
