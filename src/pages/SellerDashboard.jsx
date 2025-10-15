import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import { db, storage } from "../lib/firebase";
import { doc, setDoc, collection, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PriceInput from "../components/PriceInput";

function Content(){
  const { user, profile } = useAuth();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("general");
  const [file, setFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(()=>{ if (!profile?.plan) window.location.replace("/seller/plan"); }, [profile]);

  useEffect(()=> {
    if (!user) return;
    const q = query(collection(db, "photos"), where("ownerUid", "==", user.uid));
    return onSnapshot(q, (snap) => {
      const rows = []; snap.forEach(d => rows.push({ id: d.id, ...d.data() })); setPhotos(rows);
    });
  }, [user]);

  const upload = async () => {
    if (!file || !title || !price) return alert("Fill all fields");
    const fileRef = ref(storage, `seller/${user.uid}/${Date.now()}-${file.name}`);
    setBusy(true);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    const id = crypto.randomUUID();
    await setDoc(doc(db, "photos", id), {
      id, title, price, category, url,
      ownerUid: user.uid, ownerEmail: user.email, planId: profile?.plan?.id,
      createdAt: serverTimestamp()
    });
    setTitle(""); setPrice(""); setCategory("general"); setFile(null);
    setBusy(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-8">Seller Dashboard</h2>

      <div className="border rounded-xl p-4 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <input className="border rounded px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <PriceInput planId={profile?.plan?.id} value={price} onChange={setPrice} />
          <input className="border rounded px-3 py-2" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
          <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} />
        </div>
        <button className="btn btn-dark mt-4" onClick={upload} disabled={busy}>{busy?"Uploading...":"Upload"}</button>
        <p className="text-sm text-gray-500 mt-2">Price is capped by your active plan.</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Your Photos</h3>
      {photos.length===0 && <p>Loading...</p>}
      <div className="grid md:grid-cols-4 gap-4">
        {photos.map(p=>(
          <div key={p.id} className="border rounded-xl p-2">
            <img src={p.url} alt={p.title} className="w-full h-40 object-cover rounded"/>
            <div className="mt-2 font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">₹{p.price} • {p.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function SellerDashboard(){
  return <ProtectedRoute requireRole="seller"><Content/></ProtectedRoute>;
}
