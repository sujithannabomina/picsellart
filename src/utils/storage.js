import { getStorage, listAll, ref, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

const storage = getStorage(app);
const DIR = "public/images";

export async function listPublicImages() {
  const r = ref(storage, DIR);
  const ls = await listAll(r);
  const out = [];
  for (const item of ls.items) {
    const url = await getDownloadURL(item);
    out.push({ name: item.name, fullPath: item.fullPath, downloadURL: url, tags: [] });
  }
  return out;
}

export async function getPublicImageByName(name) {
  const r = ref(storage, `${DIR}/${name}`);
  try {
    const downloadURL = await getDownloadURL(r);
    return { name, fullPath: r.fullPath, downloadURL, tags: [] };
  } catch {
    return null;
  }
}
