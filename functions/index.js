// /functions/index.js
import { onObjectFinalized } from "firebase-functions/v2/storage";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import sharp from "sharp";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Only watermark files uploaded under Buyer/<uid>/...
function parseBuyerPath(filePath) {
  // Expected: Buyer/<uid>/<filename>
  const parts = filePath.split("/");
  if (parts.length < 3) return null;
  if (parts[0] !== "Buyer") return null;
  const uid = parts[1];
  const filename = parts.slice(2).join("/");
  return { uid, filename };
}

function makeSvgWatermark(text = "picsellart") {
  // Subtle, sleek watermark (no heavy bold)
  return Buffer.from(
    `<svg width="1200" height="1200" xmlns="http://www.w3.org/2000/svg">
      <style>
        .wm { fill:#ffffff; fill-opacity:0.65; font-size:48px; font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;}
      </style>
      <defs>
        <filter id="bg">
          <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <text x="50%" y="94%" text-anchor="middle" class="wm" filter="url(#bg)">${text}</text>
    </svg>`
  );
}

export const makeWatermark = onObjectFinalized(
  { region: "asia-south1", memory: "1GiB", concurrency: 10 },
  async (event) => {
    const file = event.data;
    const filePath = file.name; // e.g. Buyer/<uid>/foo.jpg
    if (!filePath) return;

    // Skip if it's already in /public or already watermarked
    if (filePath.startsWith("public/")) return;
    if (filePath.includes("_wm.")) return;

    const buyerInfo = parseBuyerPath(filePath);
    if (!buyerInfo) {
      // Not a Buyer path – ignore silently
      return;
    }

    const { uid, filename } = buyerInfo;
    const ext = path.extname(filename).toLowerCase();
    const base = path.basename(filename, ext);

    const tmpSrc = path.join(os.tmpdir(), `src_${Date.now()}${ext}`);
    const tmpDst = path.join(os.tmpdir(), `dst_${Date.now()}.jpg`);

    try {
      // Download original
      await bucket.file(filePath).download({ destination: tmpSrc });

      // Compose watermark
      const svg = makeSvgWatermark("picsellart");
      await sharp(tmpSrc)
        .resize({ width: 2000, withoutEnlargement: true }) // keep size reasonable
        .composite([{ input: svg, gravity: "south" }])
        .jpeg({ quality: 82 })
        .toFile(tmpDst);

      // Upload to /public/<uid>/<basename>_wm.jpg
      const publicPath = `public/${uid}/${base}_wm.jpg`;
      await bucket.upload(tmpDst, {
        destination: publicPath,
        metadata: {
          contentType: "image/jpeg",
          cacheControl: "public, max-age=31536000, immutable"
        }
      });

      // Optional: record a Firestore doc for Explore queries
      await db.collection("publicImages").doc(`${uid}_${base}`).set(
        {
          uid,
          originalPath: filePath,
          publicPath,
          title: base,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      logger.log("Watermarked ->", publicPath);
    } catch (err) {
      logger.error("Watermark error", err);
    } finally {
      // Cleanup temp files
      [tmpSrc, tmpDst].forEach((p) => {
        try { fs.unlinkSync(p); } catch (_) {}
      });
    }
  }
);
