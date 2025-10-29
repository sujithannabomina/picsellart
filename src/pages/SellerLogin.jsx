import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerLogin() {
  const { user, setRole, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const go = async () => {
      try {
        if (!user) {
          await googleLogin("seller");
        }
        if (!cancelled) {
          setRole("seller");
          navigate("/seller/dashboard", { replace: true });
        }
      } catch {
        // popup blocked etc.
      }
    };

    go();
    return () => { cancelled = true; };
  }, [user, setRole, googleLogin, navigate]);

  return <div className="p-8">Signing you in…</div>;
}
