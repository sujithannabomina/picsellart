// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp as serverTs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Prefer env vars if you’ve set them in Vercel; otherwise fall back to the values you shared.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'picsellart-619a7.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'picsellart-619a7',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'picsellart-619a7.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '347448234684',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:347448234684:web:24f131272d382cc9f1b6b9',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-3KNDHJ6JZY'
};

const app = initializeApp(firebaseConfig);

// IMPORTANT: do not call getAnalytics() here.
// It can throw in some browsers/environments and blank the app.

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, serverTs };
