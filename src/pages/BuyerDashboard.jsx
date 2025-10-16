import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const run = async () => {
      const ref = collection(db, "orders");
      const snap = await getDocs(
        query(ref, where("buyerUid", "==", user.uid), orderBy("createdAt", "desc"))
      );
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    run();
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Buyer Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Please <Link to="/buyer/login" className="text-indigo-600">log in</Link> to view your purchases.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Buyer Dashboard</h1>
      {orders.length === 0 ? (
        <p className="mt-4 text-gray-600">No purchases yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {o.title || "Photo"}
                  </div>
                  <div className="text-xs text-gray-500">₹{o.price} • {new Date(o.createdAt?.toDate?.() || o.createdAt).toLocaleString()}</div>
                </div>
                {o.status === "paid" ? (
                  <a
                    href={o.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Download HD
                  </a>
                ) : (
                  <span className="rounded-xl bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800">
                    Pending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
