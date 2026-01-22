// src/routes/BuyerRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerRoute({ children }) {
  const { user, booting } = useAuth();
  if (booting) return null;
  if (!user) return <Navigate to="/buyer/login" replace />;
  return children;
}
