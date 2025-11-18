// src/utils/storage.js
// Image helpers for Explore + View pages

// For now we load sample images from /public/images.
// You currently have sample1.jpg ... sample6.jpg there.
// You can add more later by extending SAMPLE_FILES.
const SAMPLE_FILES = [
  "sample1.jpg",
  "sample2.jpg",
  "sample3.jpg",
  "sample4.jpg",
  "sample5.jpg",
  "sample6.jpg",
];

const sampleData = SAMPLE_FILES.map((fileName, index) => {
  return {
    id: `sample-${index + 1}`,       // used in /view/:id
    name: fileName,
    category: "Street Photography",
    price: 399 + (index % 3) * 100,  // 399 / 499 / 699 just for variety
    thumbnailUrl: `/images/${fileName}`,
    watermarkedUrl: `/images/${fileName}`, // watermark is visual overlay in UI
    source: "sample",
  };
});

/**
 * Get all images for Explore.
 * (Later we can append seller uploads here.)
 */
export async function fetchAllExploreImages() {
  // Async to keep API flexible, even though this is simple now.
  return sampleData;
}

/**
 * Find a single image by ID (used on /view/:id).
 */
export async function getExploreImageById(id) {
  const all = await fetchAllExploreImages();
  return all.find((img) => img.id === id);
}

/**
 * Filter + paginate helper.
 */
export function filterAndPaginate(list, page, search) {
  const pageSize = 12;

  let filtered = list;
  if (search && search.trim()) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (img) =>
        img.name.toLowerCase().includes(term) ||
        (img.category || "").toLowerCase().includes(term)
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: filtered.slice(start, end),
    isLast: end >= filtered.length,
  };
}
