// FILE PATH: api/_lib/firebaseAdmin.js
const admin = require("firebase-admin");

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT in Vercel env.");

  // Allow either plain JSON or base64 JSON
  let json;
  try {
    json = JSON.parse(raw);
    return json;
  } catch {
    // try base64
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    return JSON.parse(decoded);
  }
}

function initAdmin() {
  if (admin.apps.length) return admin;

  const serviceAccount = getServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || serviceAccount.storageBucket,
  });

  return admin;
}

function getDb() {
  const a = initAdmin();
  return a.firestore();
}

function getBucket() {
  const a = initAdmin();
  return a.storage().bucket();
}

module.exports = {
  admin,
  initAdmin,
  getDb,
  getBucket,
};
