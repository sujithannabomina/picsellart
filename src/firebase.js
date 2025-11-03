// src/firebase.js
// Single, duplicate-safe Firebase initialization + shared SDK singletons.
// Exports googleProvider required by AuthContext.jsx.

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// IMPORTANT: Make sure all imports in your app use this path:
//   import { app, auth, db, storage, googleProvider } from "../firebase";
// Delete any duplicate files like src/utils/firebase.js.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Duplicate-safe init (prevents "App named [DEFAULT] already exists" in SPA)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Core SDK singletons
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// OAuth providers used in the app
const googleProvider = new GoogleAuthProvider();
// Optional: force account selector each time for multi-account users
googleProvider.setCustomParameters({ prompt: "select_account" });

export { app, auth, db, storage, googleProvider };
export default app;