import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import app from "../firebase";

const storage = getStorage(app);

// folders where your preview images live
const PUBLIC_FOLDERS = ["Buyer", "public"];

// small helper so prices look realistic but still auto-generated
function computePriceFromName(name) {
  const base = 399;
  const offset = (name.length * 17) % 300; // 0-299
  const rounded = offset - (offset % 50); // step of 50
  return base + rounded; // e.g. 399, 449, 499, 549, 599, 649, 699
}

/**
 * Fetches ALL public photos from Firebase Storage (Buyer + public folders),
 * in parallel for speed.
 * Used by the Explore page.
 */
export async function getAllPublicPhotos() {
  const folderPromises = PUBLIC_FOLDERS.map(async (folder) => {
    const folderRef = ref(storage, `${folder}/`);
    const result = await listAll(folderRef);

    // getDownloadURL for this folder – in parallel
    const urls = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const name = itemRef.name;
        const price = computePriceFromName(name);

        return {
          id: `${folder}/${name}`,
          path: `${folder}/${name}`,
          name,
          folder,
          url,
          price,
        };
      })
    );

    return urls;
  });

  const groups = await Promise.all(folderPromises);
  const all = groups.flat();

  // stable order by file name
  all.sort((a, b) => a.name.localeCompare(b.name));
  return all;
}

/**
 * Used on the landing page hero – just take first 3 nicely.
 */
export async function getLandingCandidates() {
  const all = await getAllPublicPhotos();
  return all.slice(0, 3);
}

/**
 * Used by the ViewImage page. Path is like "Buyer/sample3.jpg".
 */
export async function fetchPhotoUrl(storagePath) {
  const refObj = ref(storage, storagePath);
  const url = await getDownloadURL(refObj);

  const name = storagePath.split("/").pop() || storagePath;
  const price = computePriceFromName(name);

  return { url, price, name };
}
