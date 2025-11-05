/**
 * PicSellArt — Explore Data (Public Images Manifest)
 *
 * Why this file exists:
 * - The browser can’t list folder contents at runtime. So we keep a small, explicit
 *   manifest of the files that live in /public/images.
 * - Explore and Landing pull from this manifest to show cards / rotate images.
 *
 * How to add more images later:
 * 1) Drop files into: /public/images
 * 2) Add the exact filenames to RAW_FILES below (keep the order you prefer).
 *    Example: "sample7.jpg", "sunset_001.jpg"
 *
 * Tip: If your filenames follow a strict pattern (sample1.jpg..sample112.jpg),
 * you can generate that list; a helper is included at the bottom (commented).
 */

const IMAGE_BASE_PATH = "/images";

/**
 * EXACT filenames present in /public/images.
 * From your latest screenshots, the folder contains sample1..sample6.jpg.
 * If you add more, append them here.
 */
const RAW_FILES = [
  "sample1.jpg",
  "sample2.jpg",
  "sample3.jpg",
  "sample4.jpg",
  "sample5.jpg",
  "sample6.jpg",
];

/**
 * MAIN export used by the app — simple filename list.
 * Explore.jsx currently imports SAMPLE_IMAGES.
 */
export const SAMPLE_IMAGES = [...RAW_FILES];

/**
 * Optional richer manifest (id, name, url, title, price, tags…)
 * Safe for future use by cards, pricing ribbons, filters, etc.
 * Not required by Explore.jsx right now, but exported for production growth.
 */
export const IMAGE_MANIFEST = RAW_FILES.map((file, idx) => {
  const base = file.replace(/\.[^.]+$/, "");
  return {
    id: idx + 1,
    name: file,
    url: `${IMAGE_BASE_PATH}/${file}`,
    title: base,               // e.g., "sample1"
    priceINR: 199 + (idx % 6) * 20, // harmless placeholder; adjust/remove if you show price
    tags: ["public", "sample"],
  };
});

/**
 * Helper to fetch a manifest item by filename (exact match).
 */
export function findImageByName(name) {
  const safe = String(name || "");
  return IMAGE_MANIFEST.find((it) => it.name === safe) || null;
}

/**
 * Helper for landing page rotations — pick N unique random images.
 */
export function pickRandomImages(n = 3) {
  const copy = [...IMAGE_MANIFEST];
  const out = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Advanced: Generate a patterned list instead of typing filenames     */
/* (Only use this if your files truly exist with that pattern)         */
/*
function rangeSamples(from = 1, to = 112) {
  return Array.from({ length: to - from + 1 }, (_, i) => `sample${from + i}.jpg`);
}
// Example usage:
// const RAW_FILES = rangeSamples(1, 112);
*/
/* ------------------------------------------------------------------ */
