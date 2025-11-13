// src/utils/exploreData.js

/**
 * Build an image record for Explore page.
 * This creates a stable object structure for each image.
 */
export function buildImageRecord({ name, url }) {
  return {
    id: name,               // unique per storage item
    name,
    url,
    title: name.replace(/\.[^/.]+$/, ""), // remove ext
  };
}

/**
 * Get a default price for an image based on its name.
 * You can adjust this logic.
 */
export function priceForName(name) {
  const numMatch = name.match(/\d+/);
  if (!numMatch) return 99;
  const num = Number(numMatch[0]);
  return 49 + (num % 150); // 49 → 199
}
