import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

/**
 * Layout
 * Wraps all routes with:
 *  - sticky header
 *  - centered page container
 *  - simple footer
 *
 * Make sure your router uses this Layout at the top level, e.g.
 * <Route element={<Layout />}> ...children...</Route>
 */
export default function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Header />
        </div>
      </header>

      <main className="page-container">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>© {new Date().getFullYear()} Picsellart. All rights reserved.</span>
          <span>Secure payments · Verified sellers · Instant downloads</span>
        </div>
      </footer>
    </div>
  );
}
