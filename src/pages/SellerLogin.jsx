// /src/pages/SellerLogin.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerLogin() {
  const { user, loginSeller, logout } = useAuth();
  const navigate = useNavigate();

  const onLogin = async () => {
    await loginSeller();
    navigate("/start-selling"); // or your seller dashboard route
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Seller Login</h1>
      {!user ? (
        <button onClick={onLogin} className="btn-primary">Continue with Google</button>
      ) : (
        <div className="space-x-3">
          <span>Signed in as <b>{user.email}</b></span>
          <button onClick={() => navigate("/start-selling")} className="btn-primary">Go to Seller</button>
          <button onClick={logout} className="btn-ghost">Log out</button>
        </div>
      )}
    </div>
  );
}
