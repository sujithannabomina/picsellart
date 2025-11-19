// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-16">{children}</main>
    </div>
  );
};

export default Layout;
