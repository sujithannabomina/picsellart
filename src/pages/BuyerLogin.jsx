import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BuyerLogin(){
  const { user, role, loginAs } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      if (!user || role !== "buyer") {
        await loginAs("buyer");
      }
      nav("/explore", { replace: true });
    })();
  }, [user, role, loginAs, nav]);

  return <div className="container"><p>Signing you in…</p></div>;
}
