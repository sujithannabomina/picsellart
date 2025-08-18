// src/lib/firebase.js  (use this exact file path)
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ",
  authDomain: "picsellart-619a7.firebaseapp.com",
  projectId: "picsellart-619a7",
  // ✅ MUST be appspot.com, not firebasestorage.app
  storageBucket: "picsellart-619a7.appspot.com",
  messagingSenderId: "347448234684",
  appId: "1:347448234684:web:24f131272d382cc9f1b6b9",
  measurementId: "G-3KNDHJ6JZY",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
