import { useAuth } from "../context/AuthContext";

export default function SellerLogin() {
  const { user, loading, loginSeller } = useAuth();
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Seller Login</h2>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : user ? (
        <p className="text-green-700">You are logged in.</p>
      ) : (
        <button
          onClick={loginSeller}
          className="rounded-full bg-blue-600 text-white px-5 py-2 shadow hover:bg-blue-700"
        >
          Continue with Google
        </button>
      )}
    </section>
  );
}
