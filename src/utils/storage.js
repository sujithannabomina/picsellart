// Helpers to read from Firebase Storage 'public/images' and seller folder.
import { storage } from "../lib/firebase";
import { listAll, list, ref, getDownloadURL } from "firebase/storage";

export async function getThreeRandomPublicImages() {
  const baseRef = ref(storage, "public/images");
  const res = await listAll(baseRef);
  const urls = await Promise.all(res.items.map(i => getDownloadURL(i)));
  return urls.sort(() => 0.5 - Math.random()).slice(0, 3);
}

export async function listPublicImagesPage(page = 1, pageSize = 12) {
  const baseRef = ref(storage, "public/images");
  let token = undefined, all = [];
  do {
    const batch = await list(baseRef, { maxResults: 1000, pageToken: token });
    all = all.concat(batch.items);
    token = batch.nextPageToken;
  } while (token);
  const start = (page - 1) * pageSize;
  const slice = all.slice(start, start + pageSize);
  return Promise.all(slice.map(i => getDownloadURL(i)));
}
