import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

function makeWatermark(file, text = "picsellart") {
  return new Promise(async (resolve) => {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.font = `${Math.floor(canvas.width / 20)}px Arial`;
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.textAlign = "center";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);
    for (let y = -canvas.height; y < canvas.height; y += 150) {
      for (let x = -canvas.width; x < canvas.width; x += 350) {
        ctx.fillText(text, x, y);
      }
    }
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
  });
}

export default function SellerDashboard() {
  return (
    <ProtectedRoute requireRole="seller">
      <SellerDashboardInner />
    </ProtectedRoute>
  );
}

function SellerDashboardInner() {
  const { user, profile, isSellerExpired } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const upload = async () => {
    if (isSellerExpired) return alert("Your plan has expired. Renew to upload.");

    if (!file || !title || !price) {
      alert("Please fill all fields and select a file.");
      return;
    }

    try {
      setBusy(true);
      setMsg("Uploading image...");

      const photoId = crypto.randomUUID();
      const originalPath = `originals/${user.uid}/${photoId}_${file.name}`;
      const storageRef = ref(storage, originalPath);
      await uploadBytes(storageRef, file);

      const wmBlob = await makeWatermark(file);
      const wmPath = `public/watermarked/${photoId}.jpg`;
      const wmRef = ref(storage, wmPath);
      await uploadBytes(wmRef, wmBlob);
      const watermarkedUrl = await getDownloadURL(wmRef);

      setMsg("Saving metadata securely...");
      const resp = await fetch("/api/secureCreatePhoto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          title,
          price,
          tags: tags.split(/[,\s]+/).filter(Boolean),
          watermarkedUrl,
          originalPath,
        }),
      });

      const data = await resp.json();
      if (data.status === "success") {
        alert("Upload successful ✅");
        setFile(null);
        setTitle("");
        setPrice("");
        setTags("");
      } else {
        alert(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
      setMsg("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
      {isSellerExpired && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
          Your plan has expired. <a href="/seller/renew" className="underline">Renew now</a> to continue uploads.
        </div>
      )}
      <div className="space-y-3 mb-6">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Price (₹)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*"
        />
        <button
          className="btn btn-primary w-full"
          disabled={busy}
          onClick={upload}
        >
          {busy ? "Uploading..." : "Upload Image"}
        </button>
        {msg && <p className="text-gray-600 text-sm">{msg}</p>}
      </div>
    </div>
  );
}
