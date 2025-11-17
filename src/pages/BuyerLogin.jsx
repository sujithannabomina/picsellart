import React from "react";
import { useAuth } from "../context/AuthContext";

function BuyerLogin() {
  const { login } = useAuth();

  const handleClick = () => {
    login("buyer");
  };

  return (
    <div style={{ maxWidth: 640, margin: "3rem auto", padding: "0 1.5rem" }}>
      <h1>Buyer Login</h1>
      <p>Sign in with Google to purchase, download, and manage your images.</p>
      <button onClick={handleClick}>Continue with Google</button>
    </div>
  );
}

export default BuyerLogin;
