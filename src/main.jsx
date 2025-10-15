import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

window.__RAZORPAY_KEY__ = import.meta.env.VITE_RAZORPAY_KEY || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
