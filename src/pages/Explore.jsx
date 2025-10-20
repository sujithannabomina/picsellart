// src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import WatermarkedImage from "../components/WatermarkedImage";
import { fetchExplorePage } from "../utils/storage";

const PAGE_SIZE = 24;

export default function Explore(){
  const [batches, setBatches] = useState([]); // accumulated items
  const [tokens, setTokens] = useState({ public: null, buyer: null });
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => { loadMore(); /* first page */ }, []);

  async function loadMore(){
    if(loading) return;
    setLoading(true);
    try{
      const res = await fetchExplorePage({
        pageSize: PAGE_SIZE,
        tokenPublic: tokens.public,
        tokenBuyer : tokens.buyer
      });
      setBatches(prev => [...prev, ...res.items]);
      setTokens(res.next);
    } finally {
      setLoading(false);
    }
  }

  // Derived: enrich with title & price (samples use Street Photography + random price)
  const enriched = useMemo(()=>{
    const rnd = (min,max)=> Math.floor(Math.random()*(max-min+1))+min;
    return batches.map(item=>{
      const isSample = /^sample\d+\.jpg$/i.test(item.name);
      return {
        ...item,
        title: isSample ? "Street Photography" : prettify(item.name),
        price: isSample ? rnd(99, 249) : extractPrice(item.name) ?? rnd(149, 299),
      };
    });
  }, [batches]);

  const filtered = useMemo(()=>{
    const term = q.trim().toLowerCase();
    if(!term) return enriched;
    return enriched.filter(x =>
      x.title.toLowerCase().includes(term) ||
      x.name.toLowerCase().includes(term)
    );
  }, [enriched, q]);

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1>Explore Pictures</h1>
        <input
          className="input max-w-md"
          placeholder="Search by title or tag..."
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-slate-600">No results.</p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(item => (
          <article key={item.url} className="card overflow-hidden">
            <WatermarkedImage src={item.url} alt={item.title}/>
            <div className="p-3">
              <div className="text-sm text-slate-700">{item.title}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-slate-900 text-base">₹{item.price}</span>
                <button className="btn text-sm" onClick={()=>onBuy(item)}>
                  Buy
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        {(tokens.public || tokens.buyer) ? (
          <button className="btn" onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load more"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Helpers for title/price inferred from filename */
function prettify(name){
  // strip extension, replace dashes/underscores
  return name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").trim().replace(/\b\w/g,m=>m.toUpperCase());
}
function extractPrice(name){
  const m = name.match(/(?:p|price)(\d{2,4})/i);
  return m ? parseInt(m[1],10) : null;
}

/** Razorpay hook (POST only; no 405) — backend already exists at /api/createPhotoOrder */
async function onBuy(item){
  try{
    const res = await fetch("/api/createPhotoOrder",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        price: item.price,
        title: item.title,
        // If image came from Buyer uploads, include seller mapping here when you wire payouts
        source: item.source || "public",
        fileName: item.name,
        fileUrl: item.url
      })
    });
    if(!res.ok){ throw new Error(`Order init failed: ${res.status}`); }
    const data = await res.json();
    // open Razorpay here (left as-is to avoid breaking prod if key isn’t injected)
    if (window.Razorpay && data.key) {
      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Picsellart",
        description: item.title,
        handler: () => alert("Payment successful"),
        prefill: data.prefill || {},
        modal: { ondismiss: ()=>{} }
      });
      rzp.open();
    } else {
      alert("Order created. Razorpay key missing on client.");
    }
  } catch(err){
    console.error(err);
    alert("Could not start checkout.");
  }
}
