// src/utils/storage.js
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase"; // ← single source

const storage = getStorage(app);

// List images in "public/images" folder and return [{name, path, url}]
export async function listPublicImages() {
  const folderRef = ref(storage, "public/images");
  const all = await listAll(folderRef);
  const files = all.items || [];
  const out = await Promise.all(
    files.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,
        path: itemRef.fullPath,
        url,
      };
    })
  );
  // Optional: stable sort
  out.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  return out;
}

// Single file URL helper (used by detail pages)
export async function getFileUrl(path) {
  const fileRef = ref(storage, path);
  return getDownloadURL(fileRef);
}
