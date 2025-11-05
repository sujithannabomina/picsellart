// /src/utils/storage.js
// Helpers for public images in Firebase Storage

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

/**
 * Returns a download URL for "public/images/<name>"
 * @param {string} name - e.g. "sample1.jpg"
 */
export async function getPublicImageByName(name) {
  const r = ref(storage, `public/images/${name}`);
  return getDownloadURL(r);
}

/**
 * Generic: get a download URL for any storage path
 * @param {string} path - e.g. "public/images/sample1.jpg"
 */
export async function getImageUrl(path) {
  const r = ref(storage, path);
  return getDownloadURL(r);
}
