// src/utils/storage.js
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// Fetch all explore images from Firebase Storage at "public/images"
export const fetchAllExploreImages = async () => {
  const baseRef = ref(storage, "public/images");
  const result = await listAll(baseRef);

  const files = result.items || [];

  const images = await Promise.all(
    files.map(async (itemRef, index) => {
      const url = await getDownloadURL(itemRef);
      const fileName = itemRef.name;
      const price = derivePriceFromName(fileName, index);

      return {
        id: fileName,
        fileName,
        name: "Street Photography",
        url,
        originalUrl: url,
        price,
      };
    })
  );

  // Stable sort by fileName
  return images.sort((a, b) => a.fileName.localeCompare(b.fileName));
};

// Simple price logic so sample images have different prices
const derivePriceFromName = (fileName, index) => {
  const match = fileName.match(/\d+/);
  const n = match ? parseInt(match[0], 10) : index + 1;

  if (n % 5 === 0) return 999;
  if (n % 3 === 0) return 799;
  if (n % 2 === 0) return 499;
  return 399;
};

export const filterAndPaginate = (
  images,
  searchTerm,
  currentPage,
  pageSize
) => {
  const term = searchTerm.trim().toLowerCase();
  const filtered = term
    ? images.filter(
        (img) =>
          img.fileName.toLowerCase().includes(term) ||
          (img.name || "").toLowerCase().includes(term)
      )
    : images;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, currentPage), totalPages);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: filtered.slice(start, end),
    total,
    page,
    totalPages,
  };
};
