// src/pages/BuyerDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Buyer Dashboard</h1>
            <div className="mt-2 text-sm text-slate-600">
              Signed in as <span className="font-medium">{user?.email}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/explore" className="rounded-2xl bg-black px-5 py-3 text-sm text-white hover:bg-slate-900">
              Explore Pictures
            </Link>
            <button
              onClick={logout}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm hover:border-slate-400"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="text-lg font-semibold">Your Activity</div>
          <div className="mt-2 text-sm text-slate-600">
            Purchases and downloads will appear here as soon as you buy items.
          </div>
        </div>
      </div>
    </div>
  );
}
