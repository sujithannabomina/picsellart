// src/pages/BuyerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getPurchasesForBuyer } from "../utils/purchases";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Watch auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setBuyer(null);
        setPurchases([]);
        setLoading(false);
        return;
      }

      setBuyer(user);
      try {
        const data = await getPurchasesForBuyer(user.uid);
        setPurchases(data);
      } catch (err) {
        console.error("Error loading purchases", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (!buyer && !loading) {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Buyer Dashboard
        </h1>
        <p className="text-slate-600 mb-6">
          Please log in as a buyer to view your downloads.
        </p>
        <button
          onClick={() => navigate("/buyer-login")}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          Go to Buyer Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Buyer Dashboard
      </h1>
      {buyer && (
        <p className="text-slate-600 mb-8">
          Logged in as <span className="font-semibold">{buyer.email}</span>
        </p>
      )}

      {loading ? (
        <p className="text-slate-600">Loading your purchases…</p>
      ) : purchases.length === 0 ? (
        <p className="text-slate-600">
          You haven’t purchased any images yet. Explore photos to get started!
        </p>
      ) : (
        <div className="grid gap-5">
          {purchases.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm"
            >
              <img
                src={p.imageUrl}
                alt={p.imageName}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-900 truncate">
                  {p.imageName}
                </p>
                <p className="text-sm text-slate-500">
                  Purchased on{" "}
                  {p.createdAt?.toDate
                    ? p.createdAt.toDate().toLocaleString()
                    : p.createdAt instanceof Date
                    ? p.createdAt.toLocaleString()
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-indigo-600 mb-2">
                  ₹{(p.amount || 0) / 100}
                </p>
                <button
                  onClick={() => window.open(p.imageUrl, "_blank")}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
