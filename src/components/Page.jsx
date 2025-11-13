// src/components/Page.jsx
import React from "react";

export default function Page({ title, children }) {
  return (
    <div className="page-root">
      {title && <h1 className="page-title">{title}</h1>}
      <div className="page-body">{children}</div>
    </div>
  );
}
