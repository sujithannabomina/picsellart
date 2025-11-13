// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import "./Header.css"; // ensure header styles are loaded

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
