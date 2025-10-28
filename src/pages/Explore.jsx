// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

export default function Explore() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const folder = ref(storage, "public/images");
        const { items } = await listAll(folder);
        const urls = await Promise.all(items.map((it) => getDownloadURL(it)));
        setPhotos(urls);
      } catch (e) {
        console.error(e);
        setError("Failed to load photos. Please try again.");
      }
    }
    load();
  }, []);

  return (
    <div className="pageWrap">
      <h2 className="pageTitle">Explore</h2>
      {error && <p className="error">{error}</p>}
      {!error && photos.length === 0 && <p className="muted">No photos found. Try again later.</p>}
      <div className="grid">
        {photos.map((src) => (
          <div key={src} className="card">
            <img src={src} alt="photo" />
            <div className="cardBar">
              <button className="btn xs">View</button>
              <button className="btn xs primary">Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
