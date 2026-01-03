import React from "react";
import { useAuth } from "../context/AuthContext";

export default function BuyerDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-4xl font-semibold">Buyer Dashboard</h1>
      <p className="mt-2 text-black/70">
        Welcome, <span className="font-medium">{user?.email}</span>
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Purchases</h2>
          <p className="mt-1 text-sm text-black/60">
            Your purchases history will appear here.
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Downloads</h2>
          <p className="mt-1 text-sm text-black/60">
            After payment verification, download links will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
