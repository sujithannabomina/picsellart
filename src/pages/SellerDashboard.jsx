import React from "react";
import { useAuth } from "../context/AuthContext";

export default function SellerDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-4xl font-semibold">Seller Dashboard</h1>
      <p className="mt-2 text-black/70">
        Welcome, <span className="font-medium">{user?.email}</span>
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Plan</h2>
          <p className="mt-1 text-sm text-black/60">Starter / Pro / Elite plan status goes here.</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Uploads</h2>
          <p className="mt-1 text-sm text-black/60">Upload count and limits go here.</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Sales</h2>
          <p className="mt-1 text-sm text-black/60">Sales and earnings summary goes here.</p>
        </div>
      </div>
    </div>
  );
}
