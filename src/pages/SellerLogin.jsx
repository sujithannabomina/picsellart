// src/pages/SellerLogin.jsx
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerLogin() {
  const { user, ready, signInSeller } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (ready && user) nav("/seller/dashboard");
  }, [ready, user, nav]);

  const go = async () => {
    await signInSeller();
    nav("/seller/dashboard");
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-bold">Seller Login</h1>
        <p className="mt-2 text-slate-700">
          Login with Google to upload and sell your images.
        </p>
        <button
          onClick={go}
          className="mt-6 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Continue with Google
        </button>
      </main>
    </>
  );
}
