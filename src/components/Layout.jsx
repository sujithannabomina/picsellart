// ═══════════════════════════════════════════════════════════════════════════
// FILE PATH: src/components/Layout.jsx
// ✅ FIXED: Safe area insets for mobile notch and navigation bar
// ═══════════════════════════════════════════════════════════════════════════
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ✅ Navbar with top safe area for phone notch/status bar */}
      <div style={{ paddingTop: "env(safe-area-inset-top)" }} className="bg-white sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <main className={`flex-1 ${isLanding ? "w-full" : "w-full py-8"}`}>
        <Outlet />
      </main>

      {/* ✅ Footer with bottom safe area for phone navigation bar */}
      <footer
        className="border-t border-slate-100"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="psa-container py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PicSellArt
        </div>
      </footer>

    </div>
  );
}
