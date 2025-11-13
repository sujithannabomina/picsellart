import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

export default function BuyerLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        setBusy(true);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        if (res?.user) {
          localStorage.setItem("role", "buyer");
          nav("/buyer-dashboard", { replace: true });
        } else {
          setError("Sign-in failed. Please try again.");
        }
      } catch (e) {
        setError(e?.message || "Sign-in failed. Please try again.");
      } finally {
        setBusy(false);
      }
    };
    run();
  }, [nav]);

  return (
    <div style={{maxWidth: 720, margin: "40px auto", padding: "0 16px"}}>
      <h1>Buyer Login</h1>
      {busy && <p>Authenticating…</p>}
      {error && <p style={{color:"#b91c1c"}}>{error}</p>}
    </div>
  );
}
