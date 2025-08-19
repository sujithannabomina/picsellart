// src/lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// IMPORTANT: storageBucket must be the *appspot.com* bucket, not the *.firebasestorage.app* host
const firebaseConfig = {
  apiKey: 'AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ',
  authDomain: 'picsellart-619a7.firebaseapp.com',
  projectId: 'picsellart-619a7',
  storageBucket: 'picsellart-619a7.appspot.com',
  messagingSenderId: '347448234684',
  appId: '1:347448234684:web:24f131272d382cc9f1b6b9',
  measurementId: 'G-3KNDHJ6JZY',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
