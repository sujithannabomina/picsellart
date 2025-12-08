// src/pages/Explore.jsx
import React, { useEffect, useState, useMemo } from "react";
import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

const PUBLIC_IMAGES_PATH = "public/images";

function buildPhotoObject(item, url) {
  const filename = item.name; // e.g. "sample1.jpg"
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

  // Sample images (your 112) start with "sample..."
  const isPlatformSample = /^sample/i.test(nameWithoutExt);

  // Try to extract numeric ID (sample1.jpg → 1, sample101 → 101)
  const numberMatch = nameWithoutExt.match(/(\d+)/);
  const numericId = numberMatch ? numberMatch[1] : null;

  const id = numericId || encodeURIComponent(nameWithoutExt);

  const price = isPlatformSample ? 199 : 249; // you can change later

  return {
    id,
    filename,
    name: isPlatformSample ? "Street Photography" : nameWithoutExt,
    url,
    isPlatformSample,
    price,
  };
}

export default function Explore() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      setError("");

      try {
        const folderRef = ref(storage, PUBLIC_IMAGES_PATH);
        const res = await listAll(folderRef);

        const urls = await Promise.all(
          res.items.map((item) =>
            getDownloadURL(item).then((url) => buildPhotoObject(item, url))
          )
        );

        // Sort by numeric ID if available, otherwise by filename
        urls.sort((a, b) => {
          const aNum = parseInt(a.id, 10);
          const bNum = parseInt(b.id, 10);

          if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
          return a.filename.localeCompare(b.filename);
        });

        setPhotos(urls);
      } catch (err) {
        console.error("Error loading images from Firebase Storage", err);
        setError("Failed to load images.");
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  const filteredPhotos = useMemo(() => {
    if (!searchTerm.trim()) return photos;
    const term = searchTerm.toLowerCase();
    return photos.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.filename.toLowerCase().includes(term)
    );
  }, [photos, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Explore Marketplace
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Curated images from our public gallery and verified sellers. Login
            as a buyer to purchase and download watermark-free files.
          </p>
          <div className="mt-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search street, interior, food..."
              className="w-full md:w-96 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
            />
          </div>
        </header>

        {loading && (
          <p className="text-slate-500 text-sm">Loading images from gallery…</p>
        )}

        {!loading && error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <p className="text-slate-500 text-sm">No images found.</p>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <section className="grid gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <article
                key={photo.id + photo.filename}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      {photo.name}
                    </h2>
                    <p className="text-xs text-slate-500">{photo.filename}</p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-emerald-600">
                      ₹{photo.price}
                    </span>
                    {photo.isPlatformSample && (
                      <span className="text-[10px] uppercase tracking-wide text-slate-400">
                        Picsellart sample
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    {/* VIEW – opens view page in new tab */}
                    <a
                      href={`/view/${photo.id}?file=${encodeURIComponent(
                        photo.filename
                      )}&ownerType=${
                        photo.isPlatformSample ? "platform" : "seller"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-xs md:text-sm inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </a>

                    {/* BUY – also goes to view page, but you can later handle ?buy=1 there */}
                    <a
                      href={`/view/${photo.id}?file=${encodeURIComponent(
                        photo.filename
                      )}&ownerType=${
                        photo.isPlatformSample ? "platform" : "seller"
                      }&buy=1`}
                      className="flex-1 text-xs md:text-sm inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1.5 font-medium text-white shadow-sm hover:opacity-95"
                    >
                      Buy
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
