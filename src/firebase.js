// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ",
  authDomain: "picsellart-619a7.firebaseapp.com",
  projectId: "picsellart-619a7",
  storageBucket: "picsellart-619a7.firebasestorage.app",
  messagingSenderId: "347448234684",
  appId: "1:347448234684:web:24f131272d382cc9f1b6b9",
  measurementId: "G-3KNDHJ6JZY",
};

// Core app
const app = initializeApp(firebaseConfig);

// Firestore DB
const db = getFirestore(app);

// Storage (for all photos)
const storage = getStorage(app);

// Auth + Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Named exports (used across the app)
export { app, db, storage, auth, googleProvider };

// Default export so older imports like `import app from "../firebase"` still work
export default app;
