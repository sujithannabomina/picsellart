// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ",
  authDomain: "picsellart-619a7.firebaseapp.com",
  projectId: "picsellart-619a7",
  storageBucket: "picsellart-619a7.appspot.com",
  messagingSenderId: "347448236484",
  appId: "1:347448236484:web:24f131272d382cc9f1b6b9",
  measurementId: "G-3KNDHJ6JZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);          // For login/logout
export const db = getFirestore(app);       // For storing user/photo data
export const storage = getStorage(app);    // For photo uploads

export default app;
