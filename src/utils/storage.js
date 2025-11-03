// src/utils/storage.js
// Production-ready helpers for reading public images from Firebase Storage.
// Single source of truth: imports the singleton Firebase app we defined.

import { app } from "../firebase";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage(app);
const PUBLIC_FOLDER = "public/images";

/**
 * Normalize names for safe, case-insensitive comparisons.
 */
function normalizeName(name) {
  return String(name || "").trim().toLowerCase();
}

/**
 * Return a signed download URL for a given storage path.
 * @param {string} path e.g. "public/images/sample1.jpg"
 */
export async function getFileUrl(path) {
  if (!path) throw new Error("getFileUrl: 'path' is required");
  const fileRef = ref(storage, path);
  return getDownloadURL(fileRef);
}

/**
 * List all files inside PUBLIC_FOLDER as a stable, sorted array:
 * [{ name, path, url }]
 */
export async function listPublicImages() {
  const folderRef = ref(storage, PUBLIC_FOLDER);
  const all = await listAll(folderRef);

  // Guard against empty folders
  const items = Array.isArray(all.items) ? all.items : [];

  const out = await Promise.all(
    items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,          // "sample1.jpg"
        path: itemRef.fullPath,      // "public/images/sample1.jpg"
        url,                         // signed URL for rendering
      };
    })
  );

  // Stable sort by natural name (handles sample1, sample2, sample10 correctly)
  out.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
  );

  return out;
}

/**
 * Find a single public image by its file name (case-insensitive),
 * return { name, path, url }. Throws a clear error if not found.
 *
 * Example: getPublicImageByName("sample12.jpg")
 */
export async function getPublicImageByName(fileName) {
  if (!fileName) {
    throw new Error("getPublicImageByName: 'fileName' is required");
  }

  const target = normalizeName(fileName);
  const folderRef = ref(storage, PUBLIC_FOLDER);
  const all = await listAll(folderRef);

  const items = Array.isArray(all.items) ? all.items : [];
  const match = items.find((it) => normalizeName(it.name) === target);

  if (!match) {
    // Provide helpful context for debugging
    const available = items.map((it) => it.name).slice(0, 50).join(", ");
    throw new Error(
      `Image not found: "${fileName}" in ${PUBLIC_FOLDER}. ` +
      `Available (first 50): ${available || "none"}`
    );
  }

  const url = await getDownloadURL(match);
  return {
    name: match.name,
    path: match.fullPath,
    url,
  };
}

/**
 * Optional utility: get image object by full storage path.
 * Kept here because pages sometimes pass a saved path rather than a name.
 * @param {string} path "public/images/sample1.jpg"
 */
export async function getPublicImageByPath(path) {
  return {
    name: path.split("/").pop() || path,
    path,
    url: await getFileUrl(path),
  };
}
