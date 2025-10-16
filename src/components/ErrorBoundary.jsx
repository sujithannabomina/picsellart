// src/components/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false, message: "" };

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message ?? "Something went wrong." };
  }

  componentDidCatch(err, info) {
    // optional: report to analytics
    console.error("ErrorBoundary", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>
            We hit a snag
          </h1>
          <p style={{ color: "#475569" }}>{this.state.message}</p>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              marginTop: "1rem",
              padding: ".5rem 1rem",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
