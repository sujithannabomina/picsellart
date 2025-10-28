// src/firebase.js
// Modular Firebase init with clean exports for auth, db, storage, and serverTs helper.

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  serverTimestamp,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// All values are read from Vite envs you already configured in Vercel.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  // Helpful message during builds if envs are missing
  // (won't crash the build, just informative in server logs).
  console.warn(
    "[firebase] Missing VITE_FIREBASE_* environment variables. Check Vercel Project Settings → Environment Variables."
  );
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Core SDKs
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// Small helper to get a server timestamp object consistently
const serverTs = () => serverTimestamp();

export { app, auth, provider, db, storage, serverTs, Timestamp, FieldValue };
export default app;
