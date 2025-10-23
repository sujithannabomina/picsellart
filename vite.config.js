// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Public base path (leave "/" unless you deploy under a sub-path)
  base: "/",

  // Keep the target modern but safe; no legacy plugin needed.
  build: {
    target: "es2019",
    outDir: "dist",
    sourcemap: false,
    cssMinify: true
  },

  // Helpful if you ever want to set local env fallbacks
  define: {
    __APP_NAME__: JSON.stringify("PicSellArt")
  },

  // Dev server options (local only)
  server: {
    port: 5173,
    open: true,
    strictPort: true
  },

  // Preview server options (local `npm run preview`)
  preview: {
    port: 4173,
    strictPort: true
  },

  // Resolve aliases if you decide to use them later (kept simple for now)
  resolve: {
    alias: {
      // example: "@": "/src"
    }
  },

  // Optimize common deps for faster dev start (safe defaults)
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"]
  }
});
