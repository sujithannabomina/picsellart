// src/components/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || "Something went wrong." };
  }

  componentDidCatch(err, info) {
    // Visible in the browser console on production if something crashes.
    // You can later send this to a logging service.
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>We hit a snag</h1>
          <p style={{ color: "#555" }}>{this.state.message}</p>
          <button
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1rem",
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
            onClick={() => location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
