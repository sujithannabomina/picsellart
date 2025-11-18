// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your existing Firebase config for picsellart
const firebaseConfig = {
  apiKey: "AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ",
  authDomain: "picsellart-619a7.firebaseapp.com",
  projectId: "picsellart-619a7",
  storageBucket: "picsellart-619a7.firebasestorage.app",
  messagingSenderId: "347448234684",
  appId: "1:347448234684:web:24f131272d382cc9f1b6b9",
  measurementId: "G-3KNDHJ6JZY",
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Auth + providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Storage
export const storage = getStorage(app);

// Cloud Functions (for Razorpay etc, if you use them)
export const functions = getFunctions(app);

// IMPORTANT: default export so `import app from "../firebase";` works
export default app;
