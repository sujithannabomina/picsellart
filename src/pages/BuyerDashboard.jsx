import { useAuth } from "../auth/useAuth";

export default function BuyerDashboard() {
  const { user, role, logout } = useAuth();
  if (!user || role !== "buyer") return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
        <button onClick={logout} className="text-sm px-3 py-2 rounded bg-gray-900 text-white">Logout</button>
      </div>

      <p className="text-gray-700">Welcome, {user.displayName || user.email}!</p>
      <p className="text-gray-600 mt-2">Head to <a className="text-blue-600 underline" href="/explore">Explore</a> to browse photos.</p>
    </div>
  );
}
