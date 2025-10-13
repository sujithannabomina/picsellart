// src/firebase.js
// Central Firebase bootstrap. Exports app, auth, db, storage, and Google provider.

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Prefer env vars; fall back to your known public config (safe for client apps)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'picsellart-619a7.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'picsellart-619a7',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'picsellart-619a7.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '347448234684',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:347448234684:web:24f131272d382cc9f1b6b9',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-3KNDHJ6JZY'
}

// Initialize
export const app = initializeApp(firebaseConfig)

// Core services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Providers
export const googleProvider = new GoogleAuthProvider()

// Analytics (guarded so it doesn't break SSR/build)
if (typeof window !== 'undefined') {
  isSupported()
    .then((ok) => ok && getAnalytics(app))
    .catch(() => {})
}
