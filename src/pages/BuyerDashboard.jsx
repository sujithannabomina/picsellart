// src/pages/BuyerDashboard.jsx
import { useAuth } from '../context/AuthContext';

export default function BuyerDashboard() {
  const { user } = useAuth();
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Buyer Dashboard</h1>
      <div className="rounded-xl border p-6">
        <p className="mb-2"><b>Email:</b> {user?.email}</p>
        <p className="mb-2"><b>UID:</b> {user?.uid}</p>
        {/* TODO: list purchased images, invoices, profile settings */}
        <p className="text-slate-600 mt-6">Purchases, invoices and profile settings will appear here.</p>
      </div>
    </div>
  );
}
