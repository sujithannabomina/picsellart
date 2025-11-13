import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config used by both local `npm run dev` and Vercel build
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true
  }
});
