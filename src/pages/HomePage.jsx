import { useEffect, useState } from "react";
import { ref, list, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase"; // file we already set up earlier
import { Link, useNavigate } from "react-router-dom";

/**
 * Home page:
 * - No overlap on mobile (spacer equals navbar height)
 * - Clean hero with 2 primary buttons
 * - 3 live previews pulled from Firebase Storage (public/images)
 */
export default function HomePage() {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    // Load first 3 images from Firebase Storage at public/images
    (async () => {
      try {
        const baseRef = ref(storage, "public/images");
        const res = await list(baseRef, { maxResults: 3 });
        const urls = await Promise.all(res.items.map((r) => getDownloadURL(r)));
        setPreviews(urls);
      } catch (e) {
        console.warn("Preview load failed (will just hide previews).", e);
        setPreviews([]);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Spacer for sticky navbar */}
      <div className="h-[64px]" />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Turn Your Photos into Income
        </h1>

        <p className="mt-4 text-gray-600 sm:text-lg">
          Join our marketplace where photographers, designers, and creators monetize their work.
          Buyers get instant access to unique, premium images for their projects.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/sell"
            className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Become a Seller
          </Link>
          <button
            onClick={() => navigate("/explore")}
            className="px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Explore Photos
          </button>
        </div>

        {/* Live previews from Storage */}
        {previews.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {previews.map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow">
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
