// FILE PATH: api/_lib/firebaseAdmin.js
const admin = require("firebase-admin");

function getPrivateKey() {
  const k = process.env.FIREBASE_PRIVATE_KEY;
  if (!k) return undefined;
  // Vercel env keeps \n as literal, convert it back
  return k.replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars. Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    ...(storageBucket ? { storageBucket } : {}),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
