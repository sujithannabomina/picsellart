import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BuyerLogin() {
  const { user, setRole, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const go = async () => {
      try {
        if (!user) {
          await googleLogin("buyer");
        }
        if (!cancelled) {
          setRole("buyer");
          navigate("/explore", { replace: true });
        }
      } catch {
        // stay on page; Vercel preview pop-up blocked? user can reload
      }
    };

    go();
    return () => { cancelled = true; };
  }, [user, setRole, googleLogin, navigate]);

  return <div className="p-8">Signing you in…</div>;
}
