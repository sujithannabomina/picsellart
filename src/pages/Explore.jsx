import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPublicImages } from "../utils/storage";
import WatermarkedImage from "../components/WatermarkedImage";
import { useAuth } from "../context/AuthContext";

function priceFor(name) {
  // deterministic pseudo-random price from filename
  const base = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rupees = 249 + (base % 9) * 250; // 249..2249
  return rupees;
}

export default function Explore() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [q, setQ] = useState("");
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await listPublicImages(); // uses your Firebase Storage util (public/images)
        if (mounted) setPhotos(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!q) return photos;
    const qq = q.toLowerCase();
    return photos.filter(p => p.name.toLowerCase().includes(qq));
  }, [q, photos]);

  const onView = (p) => navigate(`/photo/${encodeURIComponent(p.name)}`);

  const onBuy = (p) => {
    // Require buyer login
    if (!user || role !== "buyer") {
      navigate("/buyer");
      return;
    }
    // Create one-off photo order
    fetch("/api/createPhotoOrder", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ name: p.name, amount: priceFor(p.name)*100 })
    })
    .then(r => r.json())
    .then(({ key, amount, orderId }) => {
      const options = {
        key, amount, currency: "INR",
        order_id: orderId,
        name: "Picsellart",
        description: p.name,
        handler: async (response) => {
          await fetch("/api/verifyPhotoPayment", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ razorpay: response, name: p.name })
          });
          // redirect to a download URL page or email link
          navigate(`/photo/${encodeURIComponent(p.name)}?p=ok`);
        }
      };
      new window.Razorpay(options).open();
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Explore</h1>

      <div className="mb-4">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search photos..."
          className="border rounded px-3 py-2 w-full md:w-96"
        />
      </div>

      {loading ? (
        <div className="opacity-60">Loading photos…</div>
      ) : filtered.length === 0 ? (
        <div className="opacity-60">No matching photos.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const price = priceFor(p.name);
            return (
              <div key={p.fullPath} className="rounded-2xl overflow-hidden border">
                <WatermarkedImage src={p.downloadURL} alt={p.name} />
                <div className="p-3">
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-sm opacity-70 mb-2">Tags: {p.tags?.join(", ") || "general"}</div>
                  <div className="flex items-center gap-2">
                    <button className="btn" onClick={() => onView(p)}>View</button>
                    <button className="btn btn-primary" onClick={() => onBuy(p)}>Buy ₹{price}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
