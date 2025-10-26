import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    sourcemap: false,
    outDir: "dist",
    rollupOptions: {
      // keep everything bundled for SPA; no externals required
    }
  },
  // Vercel serves /api/* separately; SPA fallback for others:
  preview: { port: 4173 }
});
