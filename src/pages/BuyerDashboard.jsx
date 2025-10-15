import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Content(){
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const qy = query(collection(db, "purchases"), where("buyerUid","==", user.uid), orderBy("createdAt","desc"));
    return onSnapshot(qy, snap => {
      const rows=[]; snap.forEach(d=>rows.push({ id:d.id, ...d.data() })); setOrders(rows);
    });
  }, [user]);

  const download = async (purchase) => {
    const token = await getAuth().currentUser.getIdToken();
    const res = await fetch("/api/getOriginalUrl", {
      method: "POST", headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ photoId: purchase.photoId })
    });
    const data = await res.json();
    if (data?.url) { window.open(data.url, "_blank"); }
    else alert("Could not generate download link.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-8">Buyer Dashboard</h2>
      {orders.length===0 && <p>No purchases yet.</p>}
      <div className="grid4">
        {orders.map(o => (
          <div key={o.id} className="card">
            <img src={o.watermarkedUrl} className="w-full h-40 object-cover rounded" />
            <div className="mt-2 font-semibold">{o.title}</div>
            <div className="text-sm text-gray-600">₹{o.price} • {o.createdAt?.seconds ? new Date(o.createdAt.seconds*1000).toLocaleString() : ""}</div>
            <button className="btn btn-primary mt-3" onClick={()=>download(o)}>Download HD</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function BuyerDashboard(){
  return <ProtectedRoute requireRole="buyer"><Content/></ProtectedRoute>;
}
