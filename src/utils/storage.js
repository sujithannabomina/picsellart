// src/utils/storage.js

// This module lists images that live under /public/images and builds their public URLs.
// You currently have sample1.jpg ... sample6.jpg (per your screenshots).
// Add more names here as you drop more files in public/images/.
const PUBLIC_IMAGE_DIR = "/images";

const PUBLIC_IMAGE_NAMES = [
  "sample1.jpg",
  "sample2.jpg",
  "sample3.jpg",
  "sample4.jpg",
  "sample5.jpg",
  "sample6.jpg",
];

// Util: build absolute URL served by Vite/production
const asUrl = (name) => `${PUBLIC_IMAGE_DIR}/${encodeURIComponent(name)}`;

/**
 * Paginated list of images from /public/images
 * @param {number} page 1-based
 * @param {number} pageSize
 * @returns {{ items: Array<{name:string,url:string}>, total:number, page:number, pageSize:number }}
 */
export function listPublicImages(page = 1, pageSize = 24) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const slice = PUBLIC_IMAGE_NAMES.slice(start, end).map((name) => ({
    name,
    url: asUrl(name),
  }));
  return {
    items: slice,
    total: PUBLIC_IMAGE_NAMES.length,
    page,
    pageSize,
  };
}

/**
 * Find a single image by its file name (e.g., "sample3.jpg").
 * @param {string} name
 * @returns {{name:string,url:string}|null}
 */
export function getPublicImageByName(name) {
  const exists = PUBLIC_IMAGE_NAMES.includes(name);
  if (!exists) return null;
  return { name, url: asUrl(name) };
}

/**
 * Get N random distinct images for the landing page hero/gallery.
 */
export function getRandomPublicImages(n = 6) {
  const copy = [...PUBLIC_IMAGE_NAMES];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n).map((name) => ({ name, url: asUrl(name) }));
}
