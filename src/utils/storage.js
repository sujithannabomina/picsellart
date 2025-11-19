// src/utils/storage.js
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase"; // IMPORTANT: named export, not default

const storage = getStorage(app);

// We’ll cache the list of all paths so we don’t ask Firebase every time
let cachedPaths = null;

async function listAllPhotoPaths() {
  if (cachedPaths) return cachedPaths;

  const prefixes = ["Buyer", "public"];
  const allPaths = [];

  for (const folder of prefixes) {
    const listRef = ref(storage, folder);
    try {
      const res = await listAll(listRef);
      res.items.forEach((itemRef) => {
        allPaths.push(itemRef.fullPath); // e.g. "Buyer/sample1.jpg"
      });
    } catch (err) {
      console.error(`Error listing folder ${folder}:`, err);
    }
  }

  // Simple stable sort by file name
  allPaths.sort((a, b) => a.localeCompare(b));
  cachedPaths = allPaths;
  return allPaths;
}

// Simple price generator based on file name – keeps UI realistic
function computePriceFromName(name) {
  const base = 399;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) % 4;
  }
  return base + hash * 100; // 399, 499, 599, 699
}

/**
 * Landing section: get 3–4 hero candidates for the homepage
 */
export async function getLandingCandidates(limit = 3) {
  const paths = await listAllPhotoPaths();
  const firstFew = paths.slice(0, limit);

  const items = await Promise.all(
    firstFew.map(async (path) => {
      const url = await getDownloadURL(ref(storage, path));
      const fileName = path.split("/").pop() || "";
      return {
        id: encodeURIComponent(path),
        path,
        url,
        fileName,
        title: "Street Photography",
        price: computePriceFromName(fileName),
      };
    })
  );

  return items;
}

/**
 * Explore page: load ONE page of photos
 * so we only fetch 8 image URLs at a time.
 */
export async function getExplorePage(page = 1, pageSize = 8) {
  const paths = await listAllPhotoPaths();
  const total = paths.length;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pagePaths = paths.slice(start, end);

  const items = await Promise.all(
    pagePaths.map(async (path) => {
      const url = await getDownloadURL(ref(storage, path));
      const fileName = path.split("/").pop() || "";
      return {
        id: encodeURIComponent(path), // used in /view/:id route
        path,
        url,
        fileName,
        title: "Street Photography",
        price: computePriceFromName(fileName),
      };
    })
  );

  return { total, items };
}

/**
 * ViewImage page: get single photo URL by its encoded path
 * (e.g. "Buyer%2Fsample3.jpg")
 */
export async function fetchPhotoUrl(encodedPath) {
  const fullPath = decodeURIComponent(encodedPath); // "Buyer/sample3.jpg"
  const url = await getDownloadURL(ref(storage, fullPath));
  return url;
}
