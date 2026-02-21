import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

/**
 * Layout goal:
 * - Header ALWAYS visible (fix #1/#4)
 * - Do NOT “box” the LandingPage (fix scaled/trimmed look)
 * - Keep consistent spacing for other pages
 */
export default function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Landing page should control its own layout; others get neat padding */}
      <main className={isLanding ? "w-full" : "w-full py-8"}>
        <Outlet />
      </main>

      <footer className="border-t border-slate-100">
        <div className="psa-container py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PicSellArt
        </div>
      </footer>
    </div>
  );
}

