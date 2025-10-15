import { useAuth } from "../context/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerLogin() {
  const { loginWithGoogle, user, profile, isSellerExpired } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user && profile?.role === "seller") {
      if (isSellerExpired) nav("/seller/renew", { replace: true });
      else nav("/seller/dashboard", { replace: true });
    }
  }, [user, profile, isSellerExpired, nav]);

  const go = async () => { await loginWithGoogle("seller"); /* redirect handled by effect above */ };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-8">Seller Login / Sign Up</h2>
      <button className="btn btn-primary" onClick={go}>Continue with Google</button>
    </div>
  );
}
