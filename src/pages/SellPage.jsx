// src/pages/SellPage.jsx
import React, { useRef, useState } from "react";
import { db, storage } from "../lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";

// If you add Auth later, replace this with the real user UID:
const getSellerId = () => "guest";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Streetphotography");
  const [tags, setTags] = useState("");           // comma separated
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const onFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (!price || Number.isNaN(Number(price)) || Number(price) <= 0) {
      return "Enter a valid price.";
    }
    if (!file) return "Please choose an image file.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setSubmitting(true);
      setProgress(1);

      const sellerId = getSellerId();
      const safeName = file.name.replace(/\s+/g, "_");
      const path = `sellers/${sellerId}/${Date.now()}_${safeName}`;
      const ref = storageRef(storage, path);

      // Upload to Storage with progress
      const task = uploadBytesResumable(ref, file, { contentType: file.type });
      await new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => {
            const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            setProgress(pct);
          },
          reject,
          resolve
        );
      });

      // Get public download URL
      const downloadURL = await getDownloadURL(ref);

      // Build Firestore document
      const docData = {
        title: title.trim(),
        price: Number(price),
        category,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        storagePath: path,
        downloadURL,
        createdAt: serverTimestamp(),
        sellerId,
      };

      await addDoc(collection(db, "photos"), docData);

      // Reset form
      setTitle("");
      setPrice("");
      setCategory("Streetphotography");
      setTags("");
      setFile(null);
      setPreview("");
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";

      setMessage("Photo uploaded successfully! It will appear in Explore shortly.");
    } catch (err) {
      setError(err?.message || "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Sell a Photo</h1>

      {message && (
        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: 12, borderRadius: 8, marginBottom: 12 }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: 12, borderRadius: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        {/* Title */}
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Title *</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Street Photography #12"
            style={inputStyle}
          />
        </label>

        {/* Price */}
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Price (₹) *</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 199"
            type="number"
            min="1"
            step="1"
            style={inputStyle}
          />
        </label>

        {/* Category */}
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Category *</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option>Streetphotography</option>
            <option>Portrait</option>
            <option>Nature</option>
            <option>City</option>
            <option>Abstract</option>
          </select>
        </label>

        {/* Tags */}
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Tags (comma separated)</span>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="street, bokeh, night"
            style={inputStyle}
          />
        </label>

        {/* Uploader */}
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            style={{
              border: "2px dashed #d1d5db",
              borderRadius: 12,
              padding: 18,
              textAlign: "center",
              background: "#fafafa",
            }}
          >
            <p style={{ margin: 4 }}>
              Drag & drop an image here, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={{ border: "none", background: "transparent", color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}
              >
                choose a file
              </button>
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => onFile(e.target.files?.[0])}
              hidden
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{ marginTop: 10, maxHeight: 240, width: "100%", objectFit: "contain", borderRadius: 8 }}
              />
            )}
          </div>

          {progress > 0 && submitting && (
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 8, background: "#e5e7eb", borderRadius: 999 }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "#22c55e", borderRadius: 999 }} />
              </div>
              <div style={{ fontSize: 12, marginTop: 6 }}>Uploading… {progress}%</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: submitting ? "#e5e7eb" : "#111827",
              color: submitting ? "#6b7280" : "#fff",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {submitting ? "Uploading…" : "Publish Photo"}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setTitle(""); setPrice(""); setCategory("Streetphotography"); setTags("");
              setFile(null); setPreview(""); setProgress(0); setError(""); setMessage("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 14,
};
