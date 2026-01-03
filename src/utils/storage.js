// src/utils/storage.js
import { storage } from "../firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

const PUBLIC_ROOT = "public/images";
const MAX_EXPLORE_ITEMS = 120;

// simple price pattern
function priceForIndex(index) {
  const pattern = [399, 499, 599, 799];
  return pattern[index % pattern.length];
}

/**
 * List photos for Explore (public gallery).
 * Each item has: id, storagePath, filename, title, price, url
 */
export async function getExplorePhotos() {
  const rootRef = ref(storage, PUBLIC_ROOT);
  const res = await listAll(rootRef);

  const sorted = res.items
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, MAX_EXPLORE_ITEMS);

  const urls = await Promise.all(sorted.map((item) => getDownloadURL(item)));

  return sorted.map((item, index) => ({
    id: item.fullPath,
    storagePath: item.fullPath,
    filename: item.name,
    title: "Street Photography",
    price: priceForIndex(index),
    url: urls[index],
  }));
}

/**
 * Generic helper: given a storage path like "public/images/sample3.jpg"
 * or "Buyer/user123/file.jpg", return a download URL.
 */
export async function fetchPhotoUrl(storagePath) {
  const fileRef = ref(storage, storagePath);
  return getDownloadURL(fileRef);
}

/**
 * For compatibility: sometimes only filename is passed.
 * We assume it's under PUBLIC_ROOT.
 */
export async function getPhotoByFileName(fileName) {
  const path = fileName.includes("/")
    ? fileName
    : `${PUBLIC_ROOT}/${fileName}`;
  return fetchPhotoUrl(path);
}

/**
 * Optional helper for landing hero if any old code still uses it.
 * Just returns first few items from explore list.
 */
export async function getLandingCandidates(limit = 4) {
  const photos = await getExplorePhotos();
  return photos.slice(0, limit);
}

// Extra generic alias in case other modules use this name
export async function getDownloadUrlForPath(path) {
  return fetchPhotoUrl(path);
}
