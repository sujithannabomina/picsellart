// Firebase client (Auth + Storage). Firestore optional for later.
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Your project config (from your memory note)
const firebaseConfig = {
  apiKey: "AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ",
  authDomain: "picsellart-619a7.firebaseapp.com",
  projectId: "picsellart-619a7",
  storageBucket: "picsellart-619a7.firebasestorage.app",
  messagingSenderId: "347448234684",
  appId: "1:347448234684:web:24f131272d382cc9f1b6b9",
  measurementId: "G-3KNDHJ6JZY"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const storage = getStorage(app)
