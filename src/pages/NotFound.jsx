// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Not Found</h1>
      <p className="text-slate-600 mb-6 max-w-md">
        The page you’re looking for doesn’t exist, or may have moved. Use the
        navigation above or return to the homepage.
      </p>
      <button
        onClick={() => navigate("/")}
        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 shadow-md hover:shadow-lg transition duration-150"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
