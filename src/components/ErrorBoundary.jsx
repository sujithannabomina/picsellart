// src/components/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(error) {
    return { err: error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.err) {
      return (
        <main className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h1>
          <p className="text-slate-700">
            Please refresh the page. If it persists, contact support.
          </p>
        </main>
      );
    }
    return this.props.children;
  }
}
