import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Welcome {user?.displayName || "Buyer"} — your purchases will appear here after payment verification.
      </p>

      <div className="mt-8 bg-white border rounded-2xl p-6">
        <div className="text-sm text-gray-600">Email</div>
        <div className="font-semibold">{user?.email}</div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/explore")}
            className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Explore Pictures
          </button>
        </div>
      </div>
    </main>
  );
}
