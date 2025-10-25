import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    outDir: "dist",
    target: "es2020",
    sourcemap: false,
    cssMinify: true
  },
  css: {
    postcss: path.resolve(__dirname, "postcss.config.cjs")
  }
});
