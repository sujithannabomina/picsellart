// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCb5xW55HWh9op3BERJdFmvTyfgIoWbzEQ",
  authDomain: "picsellart-619a7.firebaseapp.com",
  projectId: "picsellart-619a7",
  storageBucket: "picsellart-619a7.appspot.com",
  messagingSenderId: "347448236484",
  appId: "1:347448236484:web:24f131272d382cc9f1b6b9",
  measurementId: "G-3KNDHJ6JZY"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage, ref, listAll, getDownloadURL };
