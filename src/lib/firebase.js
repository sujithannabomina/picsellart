// src/lib/firebase.js
// Proxy re-exports to avoid breaking old import paths without re-initializing.
export { app, auth, db, storage, googleProvider } from "../firebase";
