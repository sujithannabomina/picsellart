// src/components/Layout.jsx
import React from "react";
import Header from "./Header";

function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ background: "#e5e7eb", minHeight: "100vh" }}>
        {children}
      </main>
    </>
  );
}

export default Layout;
