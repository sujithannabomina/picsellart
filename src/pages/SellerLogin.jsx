import React from "react";
import { useAuth } from "../context/AuthContext";

function SellerLogin() {
  const { login } = useAuth();

  const handleClick = () => {
    login("seller");
  };

  return (
    <div style={{ maxWidth: 640, margin: "3rem auto", padding: "0 1.5rem" }}>
      <h1>Seller Login</h1>
      <p>Sign in with Google to manage your plans, uploads and earnings.</p>
      <button onClick={handleClick}>Continue with Google</button>
    </div>
  );
}

export default SellerLogin;
