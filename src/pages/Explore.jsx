import { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "../firebase"; // your initialized app

const storage = getStorage(app);

export default function Explore() {
  const [urls, setUrls] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // list both seller uploads and your public demo folder if present
        const folders = ["seller", "public/images"];
        const out = [];
        for (const folder of folders) {
          const listRef = ref(storage, folder);
          const res = await listAll(listRef).catch(() => null);
          if (!res) continue;
          for (const item of res.items) {
            const url = await getDownloadURL(item);
            out.push(url);
          }
        }
        // Fallback to local public images if storage has none
        if (out.length === 0) {
          out.push(
            "/images/sample1.jpg",
            "/images/sample2.jpg",
            "/images/sample3.jpg",
            "/images/sample4.jpg",
            "/images/sample5.jpg",
            "/images/sample6.jpg"
          );
        }
        setUrls(out);
      } catch (e) {
        console.error(e);
        setErr("Failed to load photos. Please try again.");
      }
    })();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Explore</h2>
      {err && <p className="text-red-600 mb-4">{err}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {urls.map((u) => (
          <div
            key={u}
            className="relative group rounded-xl overflow-hidden shadow"
          >
            {/* watermark overlay */}
            <img src={u} alt="pic" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition">
              <div className="w-full h-full bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.08)_0_20px,rgba(0,0,0,0)_20px_40px)]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
