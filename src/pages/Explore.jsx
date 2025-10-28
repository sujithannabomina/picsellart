// /src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import { storage } from "../firebase";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { createServerOrder, openCheckout } from "../utils/razorpay";

const STORAGE_FOLDER = "public/images"; // adjust if your sellers upload elsewhere
const WATERMARK_TEXT = "Picsellart";

async function applyWatermark(url) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const scale = 1;
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // diagonal watermark
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((-30 * Math.PI) / 180);
  ctx.font = `${Math.max(24, canvas.width * 0.05)}px sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(WATERMARK_TEXT, 0, 0);
  ctx.restore();

  return canvas.toDataURL("image/jpeg", 0.85);
}

export default function Explore() {
  const { user, loginBuyer } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const folderRef = ref(storage, STORAGE_FOLDER);
        const res = await listAll(folderRef);
        const urls = await Promise.all(res.items.map((i) => getDownloadURL(i)));
        // watermark previews in parallel (cap concurrency if needed)
        const previews = await Promise.all(urls.map((u) => applyWatermark(u)));
        const data = urls.map((originalUrl, i) => ({
          id: res.items[i].name,
          originalUrl,
          previewUrl: previews[i],
          title: res.items[i].name.replace(/\.[^.]+$/, ""),
          price: 499, // INR – adjust or fetch from metadata
        }));
        setItems(data);
      } catch (e) {
        console.error(e);
        setErr("Failed to load photos. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onBuy = async (item) => {
    try {
      // require login
      let u = user;
      if (!u) u = await loginBuyer();

      // create order on server (attach whatever metadata you need)
      const order = await createServerOrder({
        amount: item.price * 100, // paise
        currency: "INR",
        photoId: item.id,
        originalUrl: item.originalUrl,
      });

      await openCheckout({
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID, // present on client
        order,
        user: u,
        onSuccess: async (response) => {
          // TODO: hit your verify endpoint, then start download
          // e.g., window.location.href = `/api/photos/download?order=${response.razorpay_order_id}`;
          alert("Payment successful! Your download will start shortly.");
        },
      });
    } catch (e) {
      console.error(e);
      alert("Unable to start checkout. Please try again.");
    }
  };

  const content = useMemo(() => {
    if (loading) return <p className="text-slate-600">Loading photos…</p>;
    if (err) return <p className="text-red-600">{err}</p>;
    if (!items.length) return <p className="text-slate-500">No photos found.</p>;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.id} className="rounded-xl overflow-hidden bg-white shadow-sm border">
            <img src={it.previewUrl} alt={it.title} className="w-full h-56 object-cover" />
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">{it.title}</h3>
                <span className="text-sm font-semibold">₹{it.price}</span>
              </div>
              <button onClick={() => onBuy(it)} className="btn-primary w-full mt-3">
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }, [items, loading, err]);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      {content}
    </div>
  );
}
