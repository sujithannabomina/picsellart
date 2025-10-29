import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Lists images under given folder. Default: "public/images"
 * Returns [{id, url, name, title, price, tags}]
 */
export async function listImages(folder = "public/images") {
  const out = [];
  const rootRef = ref(storage, folder);
  const items = await listAll(rootRef);

  let idx = 1;
  for (const item of items.items) {
    const url = await getDownloadURL(item);
    const name = item.name;
    out.push({
      id: name.replace(/\.\w+$/, ""),
      url,
      name,
      title: name.replace(/\.\w+$/, "").replace(/[-_]/g, " "),
      price: 249 + (idx % 10) * 50, // deterministic random-ish
      tags: ["photo", "picsellart"],
    });
    idx++;
  }
  // Stable sort by name so grid doesn't jump
  out.sort((a,b)=>a.name.localeCompare(b.name));
  return out;
}
