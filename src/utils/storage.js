// src/utils/storage.js
import { getDownloadURL, list, ref } from "firebase/storage";
import { storage } from "../firebase"; // <-- unified import

// Public image root in Firebase Storage
const PUBLIC_ROOT = "public/images";

// List images under public/images with basic pagination support
export async function listPublicImages({ maxResults = 60, pageToken } = {}) {
  const rootRef = ref(storage, PUBLIC_ROOT);
  const { items, nextPageToken } = await list(rootRef, { maxResults, pageToken });
  const files = await Promise.all(
    items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,
        path: itemRef.fullPath,
        url,
      };
    })
  );
  return { files, nextPageToken: nextPageToken || null };
}

// Fetch a single public image by file name (e.g., "sample23.jpg")
export async function getPublicImageByName(filename) {
  if (!filename) throw new Error("filename is required");
  const fileRef = ref(storage, `${PUBLIC_ROOT}/${filename}`);
  const url = await getDownloadURL(fileRef);
  return { name: filename, path: fileRef.fullPath, url };
}
