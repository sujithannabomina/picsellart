// src/pages/BuyerLogin.jsx
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BuyerLogin() {
  const { user, ready, signInBuyer } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (ready && user) nav("/buyer/dashboard");
  }, [ready, user, nav]);

  const go = async () => {
    await signInBuyer();
    nav("/buyer/dashboard");
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-bold">Buyer Login</h1>
        <p className="mt-2 text-slate-700">Login with Google to purchase and download.</p>
        <button
          onClick={go}
          className="mt-6 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Continue with Google
        </button>
      </main>
    </>
  );
}
