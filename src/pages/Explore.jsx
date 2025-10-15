import { useEffect, useState } from "react";
import { listPublicImagesPage } from "../utils/storage";

export default function Explore() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  useEffect(() => { (async()=> setItems(await listPublicImagesPage(page)))(); }, [page]);
  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-8">Explore Pictures</h2>
      {items.length===0 && <p>Loading...</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(u => <img key={u} src={u} className="w-full h-48 object-cover rounded-2xl shadow"/>)}
      </div>
      <div className="flex items-center justify-center gap-4 my-8">
        <button className="btn" onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button>
        <span>Page {page}</span>
        <button className="btn" onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}
