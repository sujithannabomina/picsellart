// IMPORTANT:
// This file exists only for compatibility because some files still import:
//   import { useAuth } from "../hooks/useAuth";
// or
//   import { AuthProvider } from "./hooks/useAuth";
//
// We keep ALL real auth logic inside useAuth.jsx.
// This file simply re-exports it (no JSX here => build-safe).

export { AuthProvider, useAuth } from "./useAuth.jsx";
