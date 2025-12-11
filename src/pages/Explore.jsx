// src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // assumes you export storage
import ImageCard from "../components/ImageCard";
import Pagination from "../components/Pagination";
import { useAuth } from "../hooks/useAuth"; // assumes you already have this

const PAGE_SIZE = 12;
const PRICE_OPTIONS = [199, 249, 299, 349, 399];

function priceFromFileName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  const index = Math.abs(hash) % PRICE_OPTIONS.length;
  return PRICE_OPTIONS[index];
}

const Explore = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true);
        setError("");

        const publicRef = ref(storage, "public/images");
        const buyerRef = ref(storage, "Buyer");

        const [publicList, buyerList] = await Promise.all([
          listAll(publicRef),
          listAll(buyerRef),
        ]);

        const allItems = [...publicList.items, ...buyerList.items];

        const photoPromises = allItems.map(async (item) => {
          const url = await getDownloadURL(item);
          const fileName = item.name;

          const isFromPublic = item.fullPath.startsWith("public/");
          return {
            id: encodeURIComponent(item.fullPath),
            storagePath: item.fullPath,
            url,
            fileName,
            title: "Street Photography",
            price: priceFromFileName(fileName),
            ownerType: isFromPublic ? "platform" : "seller",
          };
        });

        const photoList = await Promise.all(photoPromises);

        // Sort newest first by storage path (approximate)
        photoList.sort((a, b) => (a.storagePath > b.storagePath ? -1 : 1));

        setPhotos(photoList);
      } catch (err) {
        console.error("Error loading photos", err);
        setError("Failed to load images.");
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  const filteredPhotos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter(
      (p) =>
        p.fileName.toLowerCase().includes(q) ||
        (p.title || "").toLowerCase().includes(q)
    );
  }, [photos, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPhotos.length / PAGE_SIZE)
  );

  const pagedPhotos = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPhotos.slice(start, start + PAGE_SIZE);
  }, [filteredPhotos, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const handleView = (photo) => {
    const url = `/view/${photo.id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleBuy = (photo) => {
    if (!user) {
      navigate("/buyer-login");
      return;
    }
    const url = `/view/${photo.id}?buyNow=1`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
      <section className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Explore Marketplace
          </h1>
          <p className="text-sm md:text-base text-slate-700 mb-4">
            Curated images from our public gallery and verified sellers. Login
            as a buyer to purchase and download watermark-free files.
          </p>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search street, interior, food..."
            className="w-full max-w-md px-4 py-2 rounded-full border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
          />
        </header>

        {loading && (
          <p className="text-sm text-slate-600">Loading images...</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <p className="text-sm text-slate-600">
            No images found. Try a different search.
          </p>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pagedPhotos.map((photo) => (
                <ImageCard
                  key={photo.id}
                  photo={photo}
                  onView={handleView}
                  onBuy={handleBuy}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
      </section>
    </main>
  );
};

export default Explore;
