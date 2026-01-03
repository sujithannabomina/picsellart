import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerLogin() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/seller-dashboard";

  const onLogin = async () => {
    await loginAs("seller");
    navigate(redirect, { replace: true });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900">Seller Login</h1>
      <p className="text-gray-600 mt-2">Login to manage your plan, upload images, and track your sales.</p>

      <div className="mt-8 bg-white border rounded-2xl p-6 max-w-xl">
        <button
          onClick={onLogin}
          className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
