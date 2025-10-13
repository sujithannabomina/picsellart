// src/pages/SellerDashboard.jsx
import { useAuth } from '../context/AuthContext';

export default function SellerDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Seller Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border p-6">
          <div className="text-sm text-slate-600">Account</div>
          <div className="mt-2"><b>Email:</b> {user?.email}</div>
          <div className="mt-1"><b>UID:</b> {user?.uid}</div>
        </div>
        <div className="rounded-xl border p-6">
          <div className="text-sm text-slate-600">Uploads</div>
          <div className="mt-2">Uploads remaining / plan</div>
        </div>
        <div className="rounded-xl border p-6">
          <div className="text-sm text-slate-600">Earnings</div>
          <div className="mt-2">Sales & payouts summary</div>
        </div>
      </div>
    </div>
  );
}
