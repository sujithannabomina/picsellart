// src/pages/BuyerLogin.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function BuyerLogin(){
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/buyer/dashboard";

  const login = async () => {
    try{
      const prov = new GoogleAuthProvider();
      await signInWithPopup(auth, prov);
      navigate(redirectTo, { replace:true });
    }catch(e){
      alert("Google sign-in failed. Please try again.");
      console.error(e);
    }
  };

  return (
    <main className="container" style={{maxWidth: 560}}>
      <h1 className="h1">Buyer Login / Sign Up</h1>
      <p className="subtle" style={{marginBottom:16}}>Sign in to purchase and download your photos.</p>
      <button className="btn google block" onClick={login}>
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" width="18" height="18"/>
        Continue with Google
      </button>
    </main>
  );
}
