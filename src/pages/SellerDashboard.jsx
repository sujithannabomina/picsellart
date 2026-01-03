import React from "react";
import { useAuth } from "../context/AuthContext";

export default function SellerDashboard() {
  const { user } = useAuth();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Welcome {user?.displayName || "Seller"} — uploads, sales, and plan status will appear here.
      </p>

      <div className="mt-8 bg-white border rounded-2xl p-6">
        <div className="text-sm text-gray-600">Email</div>
        <div className="font-semibold">{user?.email}</div>

        <div className="mt-6 text-gray-600 text-sm">
          Next step: connect Seller Upload flow (we’ll do it after payment is stable).
        </div>
      </div>
    </main>
  );
}
