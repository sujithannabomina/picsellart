import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for SPA + hashed assets in /dist
export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      input: "index.html"
    }
  },
  server: {
    port: 5173,
    strictPort: false
  },
  preview: {
    port: 4173
  }
});
