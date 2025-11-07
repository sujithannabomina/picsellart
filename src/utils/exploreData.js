// src/utils/exploreData.js

export const DEFAULT_PAGE_SIZE = 24;

export function priceToINR(amount) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}

export function nextPage(page, total, pageSize = DEFAULT_PAGE_SIZE) {
  const last = Math.max(1, Math.ceil(total / pageSize));
  return Math.min(last, page + 1);
}

export function prevPage(page) {
  return Math.max(1, page - 1);
}

/**
 * Deterministic pseudo-random price (stable per filename)
 * range: 149 – 249
 */
export function derivePriceFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  const base = 149;
  const span = 101; // 149..250 (exclusive upper)
  return base + (hash % span);
}

/**
 * Build unified ImageRecord object
 */
export function buildImageRecord({ url, path, name }) {
  return {
    url,
    path,
    name,
    title: "Street Photography",
    price: derivePriceFromName(name),
  };
}
