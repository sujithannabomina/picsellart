// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ",
  authDomain: "picsellart-619a7.firebaseapp.com",
  projectId: "picsellart-619a7",
  storageBucket: "picsellart-619a7.appspot.com",
  messagingSenderId: "347448236484",
  appId: "1:347448236484:web:24f131272d382cc9f1b6b9",
  measurementId: "G-3KNDHJ6JZY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export all required Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
