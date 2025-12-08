// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="page-inner">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
