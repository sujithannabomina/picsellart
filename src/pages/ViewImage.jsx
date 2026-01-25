import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";

export default function ViewImage() {
  const nav = useNavigate();
  const { name } = useParams(); // sample1.jpg
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const filename = decodeURIComponent(name || "");
        const storagePath = `public/images/${filename}`;
        const u = await getDownloadURL(ref(storage, storagePath));
        setUrl(u);
      } catch (e) {
        console.error(e);
        setUrl("");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [name]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!url) return <div className="p-8">Not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <button
          onClick={() => nav(-1)}
          className="mb-4 rounded-xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400"
        >
          ← Back
        </button>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <img src={url} alt="Preview" className="w-full max-h-[70vh] object-contain bg-white" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="select-none text-black/10 text-3xl md:text-5xl font-extrabold tracking-[0.35em] rotate-[-20deg]">
              PICSELLART
            </span>
          </div>
