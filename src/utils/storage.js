// Public-images helper backed by your existing exploreData manifest
// (we cannot read directories at runtime; the manifest lists filenames)
import { SAMPLE_IMAGES } from "./exploreData";

// Return paginated list usable by Explore.jsx
export function listPublicImages(page = 1, pageSize = 12) {
  const items = SAMPLE_IMAGES.map((name, i) => ({
    id: i + 1,
    name,
    url: `/images/${name}`,
  }));
  const start = (page - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return { items: slice, total: items.length, page, pageSize };
}

// Find one by filename
export function getPublicImageByName(name) {
  const safe = String(name || "");
  if (!SAMPLE_IMAGES.includes(safe)) return null;
  return { name: safe, url: `/images/${safe}` };
}
