import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./Header.css";

export default function Layout() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="page-wrapper">
        <div className="page-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
