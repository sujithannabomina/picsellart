// CommonJS (no ESM fuss). Node.js 20 runtime.
// Trigger: when a file is uploaded to Firebase Storage.

const { onObjectFinalized } = require("firebase-functions/v2/storage");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const path = require("path");

// Initialize Admin SDK once
try {
  admin.initializeApp();
} catch (_) {
  /* already initialized */
}

/**
 * Helper: Title-case a string: "street_photography 12" -> "Street Photography 12"
 */
function toTitleCase(s) {
  return s
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

/**
 * Helper: parse metadata from filename.
 * Accepts any of these:
 *   - "Title -- Category -- 149 -- city+night+street.jpg"
 *   - "Title__Category__149__city,night,street.png"
 *   - "title_category_149_city-night-street.jpeg"
 *   - "just_a_title.jpg"   (fallbacks only)
 *
 * Returns { title, category, price, tags[] }
 */
function parseFromFilename(nameWithoutExt) {
  // Prefer double separators first
  let raw = nameWithoutExt;
  let parts = raw.split(/\s*--\s*/); // "Title -- Category -- 149 -- tags"
  if (parts.length < 2) {
    parts = raw.split(/\s*__\s*/); // "Title__Category__149__tags"
  }
  if (parts.length < 2) {
    parts = raw.split(/[_]+/); // "title_category_149_tags"
  }

  // Defaults
  let title = toTitleCase(raw);
  let category = "";
  let price = null;
  let tags = [];

  // Try to map parts smartly
  if (parts.length >= 1 && parts[0]) title = toTitleCase(parts[0]);
  if (parts.length >= 2 && parts[1]) category = toTitleCase(parts[1]);

  // Price can be part[2] if it looks like a number
  if (parts.length >= 3 && parts[2]) {
    const maybe = String(parts[2]).replace(/[^\d.]/g, "");
    const num = Number(maybe);
    if (Number.isFinite(num)) price = num;
  }

  // Tags in part[3] (or any remaining parts joined)
  if (parts.length >= 4) {
    const tagChunk = parts.slice(3).join(" ");
    tags = tagChunk
      .split(/[,+\s\-]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return { title, category, price, tags };
}

/**
 * MAIN TRIGGER:
 * - Only acts on "public/images/**"
 * - Only for image content types
 * - Skips if already decorated (_decorated === '1')
 * - Writes customMetadata { title, category, price, tags }
 */
exports.onPublicImageUploaded = onObjectFinalized(
  {
    region: "us-central1",
    memory: "256MiB", // plenty for metadata updates
    timeoutSeconds: 60,
  },
  async (event) => {
    const object = event.data;

    // Safety checks
    const name = object.name || "";
    const contentType = object.contentType || "";
    if (!name.startsWith("public/images/")) {
      logger.debug(`Skipping non-public path: ${name}`);
      return;
    }
    if (!contentType.startsWith("image/")) {
      logger.debug(`Skipping non-image contentType: ${contentType}`);
      return;
    }
    if (object.metadata && object.metadata._decorated === "1") {
      logger.debug(`Already decorated: ${name}`);
      return;
    }

    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(name);

    // Parse filename pieces -> metadata
    const base = path.basename(name);
    const nameNoExt = base.replace(/\.[^/.]+$/, "");
    const parsed = parseFromFilename(nameNoExt);

    // Build final metadata (always strings in Storage custom metadata)
    const customMetadata = {
      title: String(parsed.title || ""),
      category: String(parsed.category || ""),
      // keep price as a simple number string (no currency symbol)
      price:
        parsed.price != null && Number.isFinite(parsed.price)
          ? String(parsed.price)
          : "",
      tags: (parsed.tags || []).join(","), // comma-separated
      _decorated: "1", // guard to avoid infinite loops
    };

    // Merge with any existing customMetadata on the object
    const existing = (object.metadata && object.metadata) || {};
    const finalMeta = {
      metadata: {
        ...existing,
        ...customMetadata,
      },
      // Optional: keep Cache-Control if you want CDN to cache images
      cacheControl: object.cacheControl || "public, max-age=3600, s-maxage=86400",
    };

    await file.setMetadata(finalMeta);
    logger.info(`Decorated ${name} with metadata`, customMetadata);
  }
);
