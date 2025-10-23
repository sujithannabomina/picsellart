import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  root: ".",                    // project root (contains index.html)
  publicDir: "public",          // static assets
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  server: {
    port: 5173,
    strictPort: true,
    open: false
  },
  preview: {
    port: 4173,
    strictPort: true
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2020",           // avoids top-level-await issues from earlier
    cssMinify: true,
    rollupOptions: {
      // keep axios bundled (don’t externalize)
      // SPA entry is root index.html – Vite handles it by default
    }
  },
  css: {
    // Use your existing PostCSS / Tailwind config files
    postcss: path.resolve(__dirname, "postcss.config.cjs")
  }
});
