import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Profile() {
  const { user, role } = useAuth();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    (async () => {
      if (user?.uid && role === "seller") {
        const d = await getDoc(doc(db, "plans", user.uid));
        if (d.exists()) setPlan(d.data());
      }
    })();
  }, [user, role]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Profile</h1>

      <div className="card p-6 grid gap-6 md:grid-cols-2">
        <div className="flex gap-4 items-center">
          <img
            src={user.photoURL || "https://i.pravatar.cc/120"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover ring-2 ring-white shadow"
          />
          <div>
            <div className="font-bold text-lg">{user.displayName || "User"}</div>
            <div className="text-slate-600 text-sm">{user.email}</div>
            <div className="text-xs mt-1">Role: <b>{role || "-"}</b></div>
          </div>
        </div>

        {role === "seller" && (
          <div className="grid gap-1">
            <div className="font-semibold">Seller Plan</div>
            <div className="text-sm">Status: {plan?.active ? "Active" : "—"}</div>
            <div className="text-sm">Plan: {plan?.planId || "—"}</div>
            <div className="text-sm">Uploads left: {plan?.uploads ?? "—"}</div>
            <div className="text-sm">Price cap per image: ₹{plan?.maxPrice ?? "—"}</div>
          </div>
        )}
      </div>
    </div>
  );
}
