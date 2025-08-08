import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <h1>Welcome to Picsellart</h1>
      <p>Your platform for buying and selling creative photos.</p>

      <div style={{ marginTop: "1rem" }}>
        <Link to="/seller-login">
          <button style={{ marginRight: "1rem" }}>Seller Login</button>
        </Link>
        <Link to="/buyer-login">
          <button>Buyer Login</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
