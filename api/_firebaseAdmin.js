// api/_firebaseAdmin.js
let admin = null;

function getAdmin() {
  if (admin) return admin;

  const firebaseAdmin = require("firebase-admin");

  if (!firebaseAdmin.apps.length) {
    // Prefer GOOGLE_APPLICATION_CREDENTIALS on the platform (recommended)
    // or a JSON string in FIREBASE_SERVICE_ACCOUNT.
    const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : undefined;

    firebaseAdmin.initializeApp(
      svcJson
        ? { credential: firebaseAdmin.credential.cert(svcJson) }
        : { credential: firebaseAdmin.credential.applicationDefault() }
    );
  }

  admin = {
    auth: firebaseAdmin.auth(),
    db: firebaseAdmin.firestore(),
    storage: firebaseAdmin.storage(),
    app: firebaseAdmin.app(),
  };
  return admin;
}

module.exports = { getAdmin };
