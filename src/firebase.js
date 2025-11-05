// Single source of truth for client Firebase (prevents app/duplicate-app)
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Use your existing env/config (your .env is already set for Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// IMPORTANT: only initialize once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Client SDK objects
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export a Google provider (fixes build error)
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
