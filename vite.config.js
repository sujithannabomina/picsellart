import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration optimized for Vercel
export default defineConfig({
  plugins: [react()],
  base: '/', // ensures assets load correctly at picsellart.com root
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // suppress large chunk warnings
  },
  server: {
    port: 5173, // for local dev
    open: true,
  },
});
