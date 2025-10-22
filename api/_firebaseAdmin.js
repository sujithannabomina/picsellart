// /api/_firebaseAdmin.js
import * as admin from "firebase-admin";

let app;
if (!admin.apps.length) {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!sa) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing");
  }
  const serviceAccount = JSON.parse(sa);

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // optional if you plan to use Storage from API
  });
} else {
  app = admin.app();
}

export const adminApp = app;
export const adminDb = admin.firestore();
export const adminFieldValue = admin.firestore.FieldValue;
export const adminTimestamp = admin.firestore.Timestamp;
