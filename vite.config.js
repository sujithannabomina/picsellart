import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for Picsellart
export default defineConfig({
  plugins: [react()],
  base: '/', // important for Vercel
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
});
