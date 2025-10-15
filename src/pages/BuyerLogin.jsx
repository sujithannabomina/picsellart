import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function BuyerLogin() {
  const { loginWithGoogle } = useAuth();
  const nav = useNavigate();
  const go = async () => { await loginWithGoogle("buyer"); nav("/buyer/dashboard", { replace:true }); };
  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-8">Buyer Login / Sign Up</h2>
      <button className="btn" onClick={go}>Continue with Google</button>
    </div>
  );
}
