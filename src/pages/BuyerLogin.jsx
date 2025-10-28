import { useAuth } from "../context/AuthContext";

export default function BuyerLogin() {
  const { user, loading, loginBuyer } = useAuth();
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Buyer Login</h2>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : user ? (
        <p className="text-green-700">You are logged in.</p>
      ) : (
        <button
          onClick={loginBuyer}
          className="rounded-full bg-blue-600 text-white px-5 py-2 shadow hover:bg-blue-700"
        >
          Continue with Google
        </button>
      )}
    </section>
  );
}
