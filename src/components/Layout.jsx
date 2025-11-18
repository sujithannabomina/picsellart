// src/components/Layout.jsx
import React from "react";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main>{children}</main>
    </div>
  );
}
