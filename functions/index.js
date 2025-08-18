// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// 1) Auto metadata when NEW images are uploaded (keeps Explore in sync for sellers)
exports.onPublicImageUploaded = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name || '';
  if (!filePath.startsWith('public/images/')) return; // ignore other folders

  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);
  const [metadata] = await file.getMetadata();
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 365 // 1 year
  });

  const docId = filePath.replace(/\//g, '__'); // simple unique id
  const isSample = true; // these are public samples

  await admin.firestore().collection('photos').doc(docId).set({
    path: filePath,
    downloadURL: url,
    title: 'Street Photography',
    price: 0,
    category: 'Streetphotography',
    tags: ['street', 'photography', 'sample'],
    width: metadata?.metadata?.width ? Number(metadata.metadata.width) : null,
    height: metadata?.metadata?.height ? Number(metadata.metadata.height) : null,
    bytes: object.size ? Number(object.size) : null,
    contentType: object.contentType || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isSample,
    sellerId: null
  }, { merge: true });
});

// 2) One-time backfill to create docs for EXISTING files in public/images
// Protect with a simple shared secret in query: ?secret=YOUR_SECRET
exports.backfillPublicImages = functions.https.onRequest(async (req, res) => {
  const SECRET = 'CHANGE_ME_TO_SOMETHING_LONG';
  if (req.query.secret !== SECRET) {
    return res.status(403).send('Forbidden');
  }

  try {
    const bucket = admin.storage().bucket();
    const prefix = 'public/images/';
    let [files] = await bucket.getFiles({ prefix });

    // filter out "directory" placeholders
    files = files.filter(f => f.name !== prefix);

    let created = 0;
    for (const f of files) {
      const filePath = f.name;
      const docId = filePath.replace(/\//g, '__');
      const docRef = admin.firestore().collection('photos').doc(docId);
      const snap = await docRef.get();
      if (snap.exists) continue;

      const [metadata] = await f.getMetadata();
      const [url] = await f.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365
      });

      await docRef.set({
        path: filePath,
        downloadURL: url,
        title: 'Street Photography',
        price: 0,
        category: 'Streetphotography',
        tags: ['street', 'photography', 'sample'],
        width: metadata?.metadata?.width ? Number(metadata.metadata.width) : null,
        height: metadata?.metadata?.height ? Number(metadata.metadata.height) : null,
        bytes: metadata.size ? Number(metadata.size) : null,
        contentType: metadata.contentType || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isSample: true,
        sellerId: null
      });
      created++;
    }

    res.status(200).send(`Backfill complete. Created ${created} documents.`);
  } catch (e) {
    console.error(e);
    res.status(500).send('Backfill error: ' + e.message);
  }
});
