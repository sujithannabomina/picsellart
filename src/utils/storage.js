import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

/**
 * Helper that adds a very light diagonal overlay to the preview URL
 * (keeps your existing watermark look while the raw file remains clean).
 * If you already generate watermarked previews in storage, just point to those.
 */
function withWatermark(url) {
  // simple trick via Google Images proxy is not allowed here; we just reuse same URL.
  // Keep the "PICSELLART" ribbon in Explore card as the visible watermark.
  return url;
}

async function listFolder(path) {
  const root = ref(storage, path);
  const res = await listAll(root);
  const out = [];
  for (const item of res.items) {
    const url = await getDownloadURL(item);
    out.push({
      name: item.name,
      path: path + item.name,
      urlOriginal: url,
      urlWatermarked: withWatermark(url),
      url, // alias
    });
  }
  return out;
}

// Public + Buyer inventory
export async function fetchAllExploreImages() {
  const [pub, buyer] = await Promise.all([listFolder("public/"), listFolder("Buyer/")]);
  // Merge & stable sort by name descending (newer-looking first)
  return [...pub, ...buyer].sort((a, b) => (a.name < b.name ? 1 : -1));
}

// Up to N candidates for landing hero/strip
export async function getLandingCandidates(limit = 6) {
  const all = await fetchAllExploreImages();
  return all.slice(0, Math.max(0, limit));
}
