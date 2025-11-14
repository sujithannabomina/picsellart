// src/utils/storage.js
import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { priceForName } from "./exploreData";

/**
 * Build a normalized image record from a Storage item + URL.
 * This is what the Explore page expects.
 */
function buildImageRecord(itemRef, url) {
  const fullPath = itemRef.fullPath;           // e.g. "public/images/sample1.jpg"
  const fileName = fullPath.split("/").pop();  // "sample1.jpg"
  const id = fileName.replace(/\.[^.]+$/, ""); // "sample1"

  return {
    id,
    fileName,
    storagePath: fullPath,
    title: "Street Photography",               // simple, consistent title
    price: priceForName(fileName),            // map to per-image price
    currency: "INR",
    url
  };
}

/**
 * Fetch all images for Explore from Firebase Storage.
 * Assumes they live under "public/images/" in your bucket.
 */
export async function fetchAllExploreImages() {
  const folderRef = ref(storage, "public/images");
  const listResult = await listAll(folderRef);

  if (!listResult.items.length) {
    return [];
  }

  const urls = await Promise.all(
    listResult.items.map((item) => getDownloadURL(item))
  );

  return listResult.items.map((item, index) =>
    buildImageRecord(item, urls[index])
  );
}

/**
 * Filter by search term and paginate.
 * Returns a safe current page and the images to display.
 */
export function filterAndPaginate(allImages, searchTerm, page, pageSize) {
  const term = (searchTerm || "").trim().toLowerCase();

  let filtered = allImages;
  if (term) {
    filtered = allImages.filter((img) => {
      const title = (img.title || "").toLowerCase();
      const name = (img.fileName || "").toLowerCase();
      return title.includes(term) || name.includes(term);
    });
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentPageImages = filtered.slice(startIndex, startIndex + pageSize);

  return {
    currentPageImages,
    totalPages,
    currentPage: safePage,
    totalItems: filtered.length
  };
}
