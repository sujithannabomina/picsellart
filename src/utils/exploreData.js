// src/utils/exploreData.js

/** Default number of items per page for Explore */
export const DEFAULT_PAGE_SIZE = 24;

/** Format a number (rupees) to INR without decimals (e.g., ₹199) */
export function priceToINR(value) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  } catch {
    // Fallback if Intl is unavailable
    return `₹${Math.round(Number(value || 0))}`;
  }
}

/** Clamp current page within valid bounds derived from total + pageSize */
export function clampPage(total, page, pageSize = DEFAULT_PAGE_SIZE) {
  const maxPage = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const p = Math.min(Math.max(1, Number(page) || 1), maxPage);
  return { page: p, maxPage };
}

/** Move to the next page (does not exceed max) */
export function nextPage(total, page, pageSize = DEFAULT_PAGE_SIZE) {
  const { page: p, maxPage } = clampPage(total, page, pageSize);
  return Math.min(p + 1, maxPage);
}

/** Move to the previous page (floors at 1) */
export function prevPage(total, page, pageSize = DEFAULT_PAGE_SIZE) {
  const { page: p } = clampPage(total, page, pageSize);
  return Math.max(p - 1, 1);
}

/**
 * Optional convenience: compute slice bounds for current page.
 * Not required by Explore.jsx, but handy if needed elsewhere.
 */
export function pageSlice(total, page, pageSize = DEFAULT_PAGE_SIZE) {
  const { page: p } = clampPage(total, page, pageSize);
  const start = (p - 1) * pageSize;
  const end = start + pageSize;
  return { start, end };
}
