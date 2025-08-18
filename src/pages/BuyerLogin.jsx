import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function SellerLogin() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const doLogin = async () => {
    await loginWithGoogle("seller");
    const from = location.state?.from?.pathname || "/seller";
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Seller Login</h1>
        <p className="text-gray-600 mb-6">Use Google to sign in as a <b>Seller</b>.</p>
        <button
          onClick={doLogin}
          className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:opacity-90"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
