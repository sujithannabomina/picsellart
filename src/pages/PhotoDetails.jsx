// src/pages/PhotoDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import WatermarkedImage from "../components/WatermarkedImage";
import { fetchAllExploreImages } from "../utils/storage";
import { priceToINR } from "../utils/exploreData";
import { openRazorpay } from "../utils/loadRazorpay";
import { useAuth } from "../context/AuthContext";

export default function PhotoDetails() {
  const { name } = useParams();
  const { user } = useAuth() || {};
  const [record, setRecord] = useState(null);

  useEffect(() => {
    (async () => {
      const all = await fetchAllExploreImages();
      setRecord(all.find((x) => x.name === name) || null);
    })();
  }, [name]);

  const buy = () => {
    if (!user) {
      window.location.href = "/buyer";
      return;
    }
    openRazorpay({
      amount: record.price,
      name: record.name,
      description: `Purchase: ${record.name}`,
      onSuccess: () => alert("Payment successful! (Demo checkout)"),
    });
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {!record && <p>Loading…</p>}
        {record && (
          <>
            <WatermarkedImage src={record.url} alt={record.name} />
            <h1 className="mt-4 text-2xl font-bold">{record.name}</h1>
            <div className="text-slate-600">{record.title}</div>
            <div className="mt-3 text-xl font-extrabold">{priceToINR(record.price)}</div>
            <div className="mt-4">
              <button
                onClick={buy}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Buy & Download
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
