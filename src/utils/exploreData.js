// Default number of images per page on Explore
export const DEFAULT_PAGE_SIZE = 18;

// Price buckets in INR for deterministic pricing
const PRICE_BUCKETS = [199, 249, 299, 349, 399, 449, 499, 599, 699, 799, 899, 999];

/**
 * Format a numeric price as INR e.g. 299 -> "₹299"
 */
export function priceToINR(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "₹0";
  return `₹${n.toLocaleString("en-IN")}`;
}

/**
 * Deterministic "random" price based on image name.
 * Same name -> same price bucket, so prices don't jump around.
 */
export function priceForName(name = "") {
  const trimmed = String(name).trim();
  if (!trimmed) return 299;

  let hash = 0;
  for (let i = 0; i < trimmed.length; i += 1) {
    hash = (hash + trimmed.charCodeAt(i) * (i + 7)) % 100000;
  }

  const idx = hash % PRICE_BUCKETS.length;
  return PRICE_BUCKETS[idx];
}

/**
 * Next page helper (clamped to [1, totalPages]).
 */
export function nextPage(current, totalPages) {
  if (!totalPages || totalPages <= 1) return 1;
  return Math.min(current + 1, totalPages);
}

/**
 * Previous page helper (clamped to [1, totalPages]).
 */
export function prevPage(current, totalPages) {
  if (!totalPages || totalPages <= 1) return 1;
  return Math.max(current - 1, 1);
}

/**
 * Canonical image record used across Explore & dashboards.
 *
 * @param {Object} opts
 * @param {string} opts.path - full storage path, e.g. "public/img01.jpg"
 * @param {string} opts.url - download URL
 * @param {("curated"|"seller")} opts.source - source group
 */
export function buildImageRecord({ path, url, source }) {
  const safePath = String(path || "");
  const name = safePath.split("/").pop() || safePath || "image";
  const baseTitle = "Street Photography";

  const price = priceForName(name);

  return {
    id: safePath,          // unique key
    name,                  // filename only
    title: baseTitle,      // fixed title for Explore
    price,                 // integer INR
    source: source || "curated",
    storagePath: safePath, // full storage path
    downloadURL: url,      // public / signed URL
  };
}
