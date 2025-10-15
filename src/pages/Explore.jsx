import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";

export default function Explore() {
  const [items, setItems] = useState([]);
  const [qtext, setQtext] = useState("");
  const { user, profile } = useAuth();

  useEffect(() => {
    const qy = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    return onSnapshot(qy, (snap) => {
      const rows = [];
      snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));
      setItems(rows);
    });
  }, []);

  const filtered = useMemo(() => {
    const t = qtext.trim().toLowerCase();
    if (!t) return items;
    return items.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const tags = (p.tags || []).join(" ").toLowerCase();
      return title.includes(t) || tags.includes(t);
    });
  }, [items, qtext]);

  const buy = async (photo) => {
    if (!user) { window.location.href = "/buyer/login"; return; }
    if (profile?.role !== "buyer") { alert("Please use a buyer account to purchase."); return; }

    const res = await fetch("/api/createPhotoOrder", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: photo.id })
    });
    const order = await res.json();

    const rzp = new window.Razorpay({
      key: window.__RZP_PHOTO_KEY__ || window.__RAZORPAY_KEY__ || "",
      amount: order.amount, currency: "INR",
      name: "Picsellart", description: `Purchase: ${order.photoTitle}`, order_id: order.orderId,
      handler: async (response) => {
        const verify = await fetch("/api/verifyPhotoPayment", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...response, photoId: photo.id, uid: user.uid, email: user.email })
        });
        const ok = await verify.json();
        if (ok?.status === "paid") { alert("Payment successful! Download in Buyer Dashboard."); window.location.href = "/buyer/dashboard"; }
        else alert("Payment verification failed.");
      },
      notes: { photoId: photo.id },
    });
    rzp.open();
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-8">
        <h2 className="text-3xl font-bold">Explore Pictures</h2>
        <input
          className="border rounded-xl px-4 py-2 w-full md:w-80"
          placeholder="Search by title or tag…"
          value={qtext}
          onChange={(e)=>setQtext(e.target.value)}
        />
      </div>

      {filtered.length===0 && <p>No results.</p>}

      <div className="grid4">
        {filtered.map((p) => (
          <div key={p.id} className="card">
            <img src={p.watermarkedUrl} alt={p.title} className="w-full h-40 object-cover rounded-2xl" />
            <div className="mt-3">
              <div className="font-semibold">{p.title || "Untitled"}</div>
              <div className="text-sm text-gray-600 mb-2">₹{p.price}</div>
              {Array.isArray(p.tags) && p.tags.length > 0 &&
                <div className="text-xs text-gray-500 mb-2">#{p.tags.join("  #")}</div>}
              <button className="btn btn-primary" onClick={()=>buy(p)}>Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
