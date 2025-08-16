import React, { useState } from "react";
import { storage, db } from "../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function SellerUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("street");
  const [tags, setTags] = useState(""); 
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setMsg("Please choose an image file.");
      return;
    }
    try {
      setBusy(true);
      setMsg("Uploading...");

      const ownerId = "demo-owner";

      const safeName = file.name.replace(/\s+/g, "_");
      const storagePath = `public/images/${Date.now()}_${safeName}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(db, "images"), {
        title: title.trim() || "Untitled",
        price: Number(price) || 0,
        category: category || "other",
        tags: tags
          .split(",")
          .map(t => t.trim().toLowerCase())
          .filter(Boolean),
        downloadURL,
        storagePath,
        ownerId,
        createdAt: serverTimestamp(),
      });

      setMsg(`Uploaded! ID: ${docRef.id}`);
      setFile(null);
      setTitle("");
      setPrice("");
      setCategory("street");
      setTags("");
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 border rounded-xl p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-center">Upload a Photo</h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Street Photography #1"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Price (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="9.99"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="street">Street Photography</option>
            <option value="nature">Nature</option>
            <option value="portrait">Portrait</option>
            <option value="architecture">Architecture</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Tags (comma separated)</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="bokeh, night, candid"
          />
        </div>

        <button
          disabled={busy}
          className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
        >
          {busy ? "Uploading..." : "Upload"}
        </button>

        {msg && (
          <p className="text-center text-sm text-gray-700">{msg}</p>
        )}
      </form>
    </div>
  );
}
