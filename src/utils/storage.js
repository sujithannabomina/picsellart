import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import app from "../firebase";

const storage = getStorage(app);

// Cache refs and URLs in memory so multiple navigations are fast
let cachedRefs = null; // [{ fullPath, name, ref }]
const urlCache = new Map(); // fullPath -> url

async function loadAllRefs() {
  if (cachedRefs) return cachedRefs;

  const folders = ["public", "Buyer"];

  const results = await Promise.all(
    folders.map((folder) => listAll(ref(storage, folder)))
  );

  const refs = results.flatMap((result) =>
    result.items.map((item) => ({
      fullPath: item.fullPath,
      name: item.name,
      ref: item,
    }))
  );

  // Simple sort so results are stable
  refs.sort((a, b) => a.name.localeCompare(b.name));

  cachedRefs = refs;
  return refs;
}

async function getOrCachedUrl(itemRef) {
  const key = itemRef.fullPath;
  if (urlCache.has(key)) return urlCache.get(key);
  const url = await getDownloadURL(itemRef);
  urlCache.set(key, url);
  return url;
}

/**
 * Used on the landing page to pick 3 images.
 */
export async function getLandingCandidates(limit = 3) {
  const refs = await loadAllRefs();
  const slice = refs.slice(0, limit);

  const withUrls = await Promise.all(
    slice.map(async (item) => ({
      id: item.fullPath,
      name: item.name,
      fullPath: item.fullPath,
      url: await getOrCachedUrl(item.ref),
    }))
  );

  return withUrls;
}

/**
 * Returns metadata for ALL images (without URLs) used for Explore.
 * URLs are fetched page-by-page for speed.
 */
export async function getExploreImagesMeta() {
  const refs = await loadAllRefs();

  const basePrices = [399, 499, 599, 799];

  return refs.map((item, index) => ({
    id: item.fullPath,
    name: item.name,
    fullPath: item.fullPath,
    price: basePrices[index % basePrices.length],
    title: "Street Photography",
  }));
}

/**
 * Fetch a download URL for a single storage path.
 */
export async function getImageUrlByPath(fullPath) {
  const itemRef = ref(storage, fullPath);
  return getOrCachedUrl(itemRef);
}

/**
 * Convenience for the View page – combines meta + URL.
 */
export async function getImageMeta(fullPath) {
  const url = await getImageUrlByPath(fullPath);
  const name = fullPath.split("/").pop() || "image.jpg";

  return {
    id: fullPath,
    name,
    fullPath,
    url,
    title: "Street Photography",
  };
}
