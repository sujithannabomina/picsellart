// FILE PATH: src/pages/AdminDashboard.jsx
// ✅ SIMPLE TEST VERSION - Just shows "Admin Dashboard"

import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAILS = ["jithbomina@gmail.com"];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  React.useEffect(() => {
    console.log("🎯 AdminDashboard loaded!");
    console.log("User:", user?.email);
    console.log("Is Admin:", isAdmin);

    if (!user) {
      console.log("❌ No user, redirecting to home");
      navigate("/");
      return;
    }

    if (!isAdmin) {
      console.log("❌ Not admin, redirecting to home");
      alert("Access denied. Admin only.");
      navigate("/");
      return;
    }

    console.log("✅ Admin access granted!");
  }, [user, isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        🎉 ADMIN DASHBOARD WORKS! 🎉
      </h1>
      <p style={{ fontSize: "18px", color: "#666" }}>
        Logged in as: {user?.email}
      </p>
      <button 
        onClick={logout}
        style={{ 
          marginTop: "20px", 
          padding: "10px 20px", 
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}
