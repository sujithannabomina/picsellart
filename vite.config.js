import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for SPA + Vercel
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // keep vendor chunking default – stable
  },
  server: {
    host: true,
    port: 5173
  },
  preview: {
    port: 4173
  }
});
