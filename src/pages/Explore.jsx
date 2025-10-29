import { useEffect, useState } from "react";
import { listImages } from "../utils/storage";
import { watermarkImage } from "../utils/watermark";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function CardSkeleton() {
  return (
    <div className="card sk">
      <div className="ph" />
      <div className="row"><div className="chip" /><div className="chip" /></div>
    </div>
  );
}

export default function Explore() {
  const [items, setItems] = useState(null); // null = loading
  const nav = useNavigate();
  const { user, role, loginAs } = useAuth();

  useEffect(() => {
    (async () => {
      const imgs = await listImages("public/images"); // your storage folder
      // watermark in parallel for thumbs
      const withWM = await Promise.all(
        imgs.map(async (p) => ({
          ...p,
          thumb: await watermarkImage(p.url, "Picsellart"),
        }))
      );
      setItems(withWM);
    })();
  }, []);

  const handleView = (it) => nav(`/photo/${encodeURIComponent(it.id)}`, { state: it });

  const handleBuy = async (it) => {
    if (!user || role !== "buyer") {
      await loginAs("buyer");
    }
    // Create order
    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ amount: it.price * 100, currency: "INR", notes: { photo: it.name }})
    }).then(r=>r.json());

    const rz = await import("../utils/razorpay");
    await rz.openCheckout({
      order_id: res.id,
      amount: res.amount,
      name: "Picsellart",
      description: it.title,
      notes: { photo: it.name }
    });
    // After success the webhook will mark paid; you can then fetch a signed URL
    // nav(`/order/success?photo=${encodeURIComponent(it.id)}`);
  };

  return (
    <div className="container">
      <h1>Explore</h1>

      {items === null && (
        <div className="grid">
          {Array.from({length:8}).map((_,i)=><CardSkeleton key={i}/>)}
        </div>
      )}

      {items?.length === 0 && (
        <p>No photos yet.</p>
      )}

      {items && items.length > 0 && (
        <div className="grid">
          {items.map((it) => (
            <div className="card" key={it.id}>
              <img src={it.thumb} alt={it.title} />
              <div className="meta">
                <div className="t">{it.title}</div>
                <div className="p">₹{it.price}</div>
              </div>
              <div className="row">
                <button className="pill" onClick={()=>handleView(it)}>View</button>
                <button className="pill blue" onClick={()=>handleBuy(it)}>Buy</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* minimal page CSS (you can move to your index.css)
.container{max-width:1080px;margin:0 auto;padding:32px 16px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px}
.card{border:1px solid #e5e7eb;border-radius:16px;padding:12px;background:#fff}
.card img{width:100%;height:220px;object-fit:cover;border-radius:12px}
.row{display:flex;gap:10px;align-items:center;justify-content:flex-start;margin-top:10px}
.meta{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
.t{font-weight:600}
.p{font-weight:700}
.sk .ph{height:220px;border-radius:12px;background:linear-gradient(90deg,#f3f4f6,#eef2f7,#f3f4f6);animation:sh 1.2s infinite}
.sk .chip{width:80px;height:32px;border-radius:999px;background:#eef2f7}
@keyframes sh{0%{background-position:0%}100%{background-position:100%}}
*/
