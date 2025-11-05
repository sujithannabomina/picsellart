// src/utils/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Vite envs
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// single app instance
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google provider (named export expected by AuthContext)
export const googleProvider = new GoogleAuthProvider();
// Optional but nice: always ask user which account
googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;
