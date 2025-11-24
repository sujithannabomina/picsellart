// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your existing Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ",
  authDomain: "picsellart-619a7.firebaseapp.com",
  projectId: "picsellart-619a7",
  storageBucket: "picsellart-619a7.firebasestorage.app",
  messagingSenderId: "347448234684",
  appId: "1:347448234684:web:24f131272d382cc9f1b6b9",
  measurementId: "G-3KNDHJ6JZY",
};

// Initialise core services
const app = initializeApp(firebaseConfig);

// Firestore DB for purchases, seller data, etc.
const db = getFirestore(app);

// Storage for all photos
const storage = getStorage(app);

// Named exports (recommended)
export { app, db, storage };

// Default export (so older `import app from "../firebase"` still works)
export default app;
