// src/lib/firebase.js
// Single source of truth for Firebase (used by context and pages)
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

// ---- Your existing config (unchanged) ----
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const google = new GoogleAuthProvider();

// DB
export const db = getFirestore(app);
export const serverTs = serverTimestamp;

// ---- helpers used by AuthContext ----
export async function ensureUserDoc(uid, payload) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...payload, createdAt: serverTs() });
  } else if (payload && payload.role) {
    // Keep role updated if switching paths
    await setDoc(ref, { role: payload.role }, { merge: true });
  }
  return ref;
}

export {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
};
