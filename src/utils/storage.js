import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import sampleData from "./exploreData.json";

// Fetch seller images from Firebase
async function fetchSellerImages() {
  try {
    const folder = ref(storage, "seller-images/");
    const res = await listAll(folder);

    const files = await Promise.all(
      res.items.map(async (file) => {
        const url = await getDownloadURL(file);
        return {
          id: file.name,
          name: file.name,
          category: "Seller Upload",
          price: 499,
          watermarkedUrl: url,
          thumbnailUrl: url,
        };
      })
    );

    return files;
  } catch (err) {
    console.error("Seller image fetch error", err);
    return [];
  }
}

// Merge sample images + seller images
export async function fetchAllExploreImages() {
  const seller = await fetchSellerImages();
  return [...sampleData, ...seller];
}

// Helper for find-by-id
export async function getExploreImageById(id) {
  const all = await fetchAllExploreImages();
  return all.find((x) => x.id == id);
}

// Pagination + filter
export function filterAndPaginate(list, page, search) {
  const limit = 12;

  let filtered = list;
  if (search) {
    filtered = filtered.filter((x) =>
      x.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: filtered.slice(start, end),
    isLast: end >= filtered.length,
  };
}
