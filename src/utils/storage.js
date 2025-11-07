// src/utils/storage.js
import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { buildImageRecord } from "./exploreData";

/**
 * List all files under a single prefix (non-recursive)
 */
async function listPrefixOnce(prefix) {
  const r = ref(storage, prefix);
  const { items = [] } = await listAll(r);
  const out = [];
  for (const item of items) {
    const url = await getDownloadURL(item);
    const path = item.fullPath;
    const name = item.name;
    out.push(buildImageRecord({ url, path, name }));
  }
  return out;
}

/**
 * List all sellers under sellers/ and aggregate images from sellers/{uid}/images
 * This walks two levels: sellers/ (prefixes) → images/ (items)
 */
async function listAllSellerImages() {
  const root = ref(storage, "sellers");
  const { prefixes: sellerDirs = [] } = await listAll(root);
  const all = [];
  for (const sellerDir of sellerDirs) {
    const imagesDir = ref(storage, `${sellerDir.fullPath}/images`);
    try {
      const { items = [] } = await listAll(imagesDir);
      for (const item of items) {
        const url = await getDownloadURL(item);
        const path = item.fullPath;
        const name = item.name;
        all.push(buildImageRecord({ url, path, name }));
      }
    } catch {
      // seller may not have images/ yet
    }
  }
  return all;
}

/**
 * Fetch every image for Explore: public/, Buyer/, and all seller images.
 * Requires Storage rules to allow read.
 */
export async function fetchAllExploreImages() {
  const [pub, buyer, sellers] = await Promise.all([
    listPrefixOnce("public"),
    listPrefixOnce("Buyer"),
    listAllSellerImages(),
  ]);
  // merge + sort by name for stable order
  const merged = [...pub, ...buyer, ...sellers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return merged;
}

/**
 * Filter by name and paginate in-memory
 */
export function filterAndPaginate(all, { q = "", page = 1, pageSize = 24 }) {
  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? all.filter((x) => x.name.toLowerCase().includes(needle))
    : all;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  return { total, pageItems };
}

/**
 * Helper for Photo Details – find by exact filename
 */
export function getByName(all, filename) {
  return all.find((x) => x.name === filename) || null;
}
